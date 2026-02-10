import axios from "axios";
import { useActionState } from "react";
import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const [appointments,setAppointments] = useState([])
  const [profileData, setProfileData] = useState(false)
  const [dashData,setDashData] = useState(false)
  
  // Socket and consultation request states
  const socketRef = useRef(null);
  const doctorIdRef = useRef(null); // Store doctorId separately to avoid re-renders
  const [consultationRequest, setConsultationRequest] = useState(null)

  // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments-doctor', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if(data.success){
              setProfileData(data.profileData)
              doctorIdRef.current = data.profileData._id // Store doctorId in ref
              console.log(data.profileData)
            }
            

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                //getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId,prescription) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId,prescription }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                //getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Load profile data when doctor logs in
    useEffect(() => {
        if (dToken && !profileData) {
            console.log('Loading doctor profile data...')
            getProfileData()
        }
    }, [dToken, profileData])

    // Initialize Socket.io connection when doctor is logged in
    useEffect(() => {
        if (dToken && doctorIdRef.current && !socketRef.current) {
            console.log('Doctor going online with ID:', doctorIdRef.current)
            const newSocket = io(backendUrl)
            socketRef.current = newSocket

            // Emit doctor-online event
            newSocket.emit('doctor-online', { doctorId: doctorIdRef.current })

            // Listen for incoming consultation requests
            newSocket.on('incoming-consultation-request', (data) => {
                console.log('Received consultation request:', data)
                setConsultationRequest(data)
                toast.info(`New consultation request from ${data.userName}`)
            })

            // Cleanup on unmount or logout
            return () => {
                if (socketRef.current) {
                    socketRef.current.emit('doctor-offline', { doctorId: doctorIdRef.current })
                    socketRef.current.disconnect()
                    socketRef.current = null
                }
            }
        }
        
        // Cleanup if dToken is removed (logout)
        if (!dToken && socketRef.current) {
            socketRef.current.emit('doctor-offline', { doctorId: doctorIdRef.current })
            socketRef.current.disconnect()
            socketRef.current = null
            doctorIdRef.current = null
        }
    }, [dToken, backendUrl])

    // Accept consultation request
    const acceptConsultation = (userSocketId, meetingId) => {
        if (socketRef.current) {
            socketRef.current.emit('accept-consultation', { userSocketId, meetingId, doctorName: profileData.name })
            setConsultationRequest(null)
            toast.success('Consultation accepted! Joining call...')
        }
    }

    // Decline consultation request
    const declineConsultation = (userSocketId) => {
        if (socketRef.current) {
            socketRef.current.emit('decline-consultation', { userSocketId })
            setConsultationRequest(null)
            toast.info('Consultation request declined')
        }
    }

    // Schedule consultation for later
    const scheduleConsultation = async ({ userId, doctorId, scheduledDate, scheduledTime, userSocketId }) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/consultation/schedule',
                { userId, doctorId, scheduledDate, scheduledTime },
                { headers: { dToken } }
            )

            if (data.success) {
                if (socketRef.current && userSocketId) {
                    socketRef.current.emit('schedule-consultation', { 
                        userSocketId, 
                        scheduledDate, 
                        scheduledTime,
                        doctorName: profileData.name 
                    })
                }
                setConsultationRequest(null)
                toast.success('Consultation scheduled successfully')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    consultationRequest,
    acceptConsultation,
    declineConsultation,
    scheduleConsultation

    
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;