import express from "express"
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"
import chatbotRouter from "./routes/chatbotRoute.js"
import consultationRouter from "./routes/consultationRoute.js"
import doctorModel from "./models/doctorModel.js"
import { startReminderService } from './jobs/reminderService.js'



//app config

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL ? 
            process.env.FRONTEND_URL.split(',') : 
            ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
})

const port  = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Start Background Jobs
startReminderService()

//middlewares
app.use(express.json())
app.use(cors())


// api endpoints

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/chatbot',chatbotRouter)
app.use('/api/consultation',consultationRouter)


//localhost:4000/api/admin

app.get("/", (req,res)=>{
    res.send("API WORKING")
})

// Socket.io for WebRTC signaling and consultation requests
const rooms = {}
const onlineDoctors = {} // Track online doctors by socketId

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Doctor goes online
    socket.on("doctor-online", async ({ doctorId }) => {
        console.log(`[DEBUG] Received doctor-online event for doctor ${doctorId} with socket ${socket.id}`)
        onlineDoctors[socket.id] = doctorId
        const result = await doctorModel.findByIdAndUpdate(doctorId, {
            isOnline: true,
            socketId: socket.id
        }, { new: true })
        console.log(`Doctor ${doctorId} is now online with socket ${socket.id}`)
        console.log(`[DEBUG] Updated doctor in DB:`, result ? {
            id: result._id,
            name: result.name,
            isOnline: result.isOnline,
            socketId: result.socketId
        } : 'Update failed')
    })

    // Doctor goes offline
    socket.on("doctor-offline", async ({ doctorId }) => {
        delete onlineDoctors[socket.id]
        await doctorModel.findByIdAndUpdate(doctorId, {
            isOnline: false,
            socketId: null
        })
        console.log(`Doctor ${doctorId} went offline`)
    })

    // User requests instant consultation
    socket.on("request-consultation", async (data) => {
        console.log(`[DEBUG] Received request-consultation event from socket ${socket.id}`)
        console.log(`[DEBUG] Request data:`, data)
        
        const { userId, userName, userEmail } = data
        
        // Find an online doctor
        const availableDoctor = await doctorModel.findOne({ isOnline: true })
        console.log(`[DEBUG] Database query for online doctor result:`, availableDoctor ? {
            id: availableDoctor._id,
            name: availableDoctor.name,
            isOnline: availableDoctor.isOnline,
            socketId: availableDoctor.socketId
        } : 'No doctor found')
        
        if (availableDoctor && availableDoctor.socketId) {
            // Emit to the available doctor
            io.to(availableDoctor.socketId).emit("incoming-consultation-request", {
                userId,
                userName,
                userEmail,
                userSocketId: socket.id
            })
            console.log(`Consultation request from ${userName} sent to doctor ${availableDoctor.name}`)
        } else {
            // No doctor available
            console.log(`[DEBUG] No available doctor - emitting consultation-unavailable to socket ${socket.id}`)
            socket.emit("consultation-unavailable", {
                message: "No doctors available right now. You'll be notified when one becomes available."
            })
            console.log(`[DEBUG] consultation-unavailable event emitted`)
        }
    })

    // Doctor accepts consultation
    socket.on("accept-consultation", ({ userSocketId, meetingId, doctorName }) => {
        io.to(userSocketId).emit("consultation-accepted", { meetingId, doctorName })
        console.log(`Doctor ${doctorName} accepted consultation, meeting ID: ${meetingId}`)
    })

    // Doctor declines/schedules for later
    socket.on("decline-consultation", ({ userSocketId }) => {
        io.to(userSocketId).emit("consultation-declined", {
            message: "Doctor will schedule a time with you shortly."
        })
    })

    // Doctor schedules consultation
    socket.on("schedule-consultation", ({ userSocketId, scheduledDate, scheduledTime, doctorName }) => {
        io.to(userSocketId).emit("consultation-scheduled", {
            scheduledDate,
            scheduledTime,
            doctorName,
            message: `${doctorName || 'The doctor'} has scheduled your consultation for ${scheduledDate} at ${scheduledTime}.`
        })
        console.log(`Doctor scheduled consultation for ${scheduledDate} at ${scheduledTime}`)
    })

    socket.on("join-room", ({ appointmentId, userId, userType }) => {
        socket.join(appointmentId)
        
        if (!rooms[appointmentId]) {
            rooms[appointmentId] = []
        }
        
        rooms[appointmentId].push({ socketId: socket.id, userId, userType })
        
        console.log(`[WebRTC] User ${userId} (${userType}) joined room ${appointmentId}`)
        console.log(`[WebRTC] Socket ${socket.id} joined room ${appointmentId}`)
        console.log(`[WebRTC] Room ${appointmentId} now has ${rooms[appointmentId].length} users:`, rooms[appointmentId].map(u => `${u.userId} (${u.socketId})`))
        
        const otherUsers = rooms[appointmentId].filter(user => user.socketId !== socket.id)
        
        if (otherUsers.length > 0) {
            console.log(`[WebRTC] Notifying socket ${socket.id} about other user ${otherUsers[0].socketId}`)
            socket.emit("other-user", otherUsers[0].socketId)
        } else {
            console.log(`[WebRTC] Socket ${socket.id} is alone in room, waiting for others...`)
        }
    })

    socket.on("sending-signal", ({ userToSignal, signal, callerID }) => {
        console.log(`[WebRTC] Received sending-signal from ${callerID} to ${userToSignal}`)
        console.log(`[WebRTC] Signal type: ${signal.type}, forwarding to ${userToSignal}`)
        io.to(userToSignal).emit("user-joined", { signal, callerID })
        console.log(`[WebRTC] Signal forwarded successfully`)
    })

    socket.on("returning-signal", ({ signal, callerID }) => {
        console.log(`[WebRTC] Received returning-signal, sending back to caller ${callerID}`)
        console.log(`[WebRTC] Signal type: ${signal.type}, forwarding to ${callerID}`)
        io.to(callerID).emit("receiving-returned-signal", { signal, id: socket.id })
        console.log(`[WebRTC] Answer signal forwarded successfully`)
    })

    socket.on("end-call", ({ appointmentId }) => {
        console.log(`[WebRTC] User ${socket.id} ending call in room ${appointmentId}`)
        
        // Notify all other users in the room
        if (rooms[appointmentId]) {
            rooms[appointmentId].forEach(user => {
                if (user.socketId !== socket.id) {
                    console.log(`[WebRTC] Notifying ${user.socketId} that call ended`)
                    io.to(user.socketId).emit("call-ended")
                }
            })
        }
    })

    socket.on("disconnect", async () => {
        console.log(`[WebRTC] User disconnected: ${socket.id}`)
        
        // Clean up doctor online status
        const doctorId = onlineDoctors[socket.id]
        if (doctorId) {
            await doctorModel.findByIdAndUpdate(doctorId, {
                isOnline: false,
                socketId: null
            })
            delete onlineDoctors[socket.id]
            console.log(`Doctor ${doctorId} auto-offline due to disconnect`)
        }
        
        // Clean up video call rooms and notify other participants
        for (const roomId in rooms) {
            const userIndex = rooms[roomId].findIndex(user => user.socketId === socket.id)
            
            if (userIndex !== -1) {
                console.log(`[WebRTC] Removing user ${socket.id} from room ${roomId}`)
                rooms[roomId].splice(userIndex, 1)
                
                // Notify remaining users
                rooms[roomId].forEach(user => {
                    console.log(`[WebRTC] Notifying ${user.socketId} about disconnect`)
                    io.to(user.socketId).emit("user-disconnected", socket.id)
                })
                
                // Clean up empty rooms
                if (rooms[roomId].length === 0) {
                    console.log(`[WebRTC] Room ${roomId} is now empty, deleting`)
                    delete rooms[roomId]
                }
            }
        }
    })
})


httpServer.listen(port, ()=> console.log("server started on port " + port))