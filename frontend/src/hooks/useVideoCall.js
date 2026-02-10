import { useState, useEffect, useRef } from 'react'
import Peer from 'simple-peer'
import { io } from 'socket.io-client'

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ]
}

const useVideoCall = (appointmentId, userId, userType, backendUrl) => {
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isCallEnded, setIsCallEnded] = useState(false)
    
    const socketRef = useRef(null)
    const peerRef = useRef(null)
    const otherUserRef = useRef(null)
    const callerIDRef = useRef(null)
    const localStreamRef = useRef(null)

    useEffect(() => {
        // Don't proceed if userId is not available
        if (!userId) {
            console.log('[VideoCall] Waiting for userId...')
            return
        }

        let localMediaStream = null

        const createPeer = (userToCall, stream, initiator) => {
            console.log('[VideoCall] Creating peer, initiator:', initiator, 'target:', userToCall)
            const peer = new Peer({
                initiator,
                trickle: true,
                stream: stream,
                config: ICE_SERVERS
            })

            peer.on("signal", (signal) => {
                if (initiator) {
                    console.log('[VideoCall] Initiator sending signal to:', userToCall)
                    socketRef.current.emit("sending-signal", {
                        userToSignal: userToCall,
                        callerID: socketRef.current.id,
                        signal
                    })
                } else {
                    console.log('[VideoCall] Answerer sending return signal to:', callerIDRef.current)
                    socketRef.current.emit("returning-signal", {
                        signal,
                        callerID: callerIDRef.current
                    })
                }
            })

            peer.on("stream", (remoteStream) => {
                console.log('[VideoCall] Received remote stream')
                setRemoteStream(remoteStream)
                setIsConnected(true)
            })

            peer.on("connect", () => {
                console.log('[VideoCall] Peer connected!')
            })

            peer.on("error", (err) => {
                console.error("Peer connection error:", err)
                setError("Connection failed. Please try again.")
            })

            peerRef.current = peer
            return peer
        }

        // Initialize socket connection
        console.log('[VideoCall] Creating socket connection to:', backendUrl)
        socketRef.current = io(backendUrl)

        socketRef.current.on('connect', () => {
            console.log('[VideoCall] Socket connected with ID:', socketRef.current.id)
        })

        // Set up socket listeners BEFORE getting media
        // Listen for other user already in room
        socketRef.current.on("other-user", (otherUserId) => {
            console.log('[VideoCall] Other user found:', otherUserId)
            otherUserRef.current = otherUserId
            if (localMediaStream) {
                createPeer(otherUserId, localMediaStream, true)
            }
        })

        // Listen for new user joining (incoming signals from initiator)
        socketRef.current.on("user-joined", (data) => {
            console.log('[VideoCall] User joined signal received from:', data.callerID)
            if (data.signal) {
                if (!peerRef.current) {
                    // First signal - create answerer peer
                    console.log('[VideoCall] Creating answerer peer for:', data.callerID)
                    callerIDRef.current = data.callerID
                    if (localMediaStream) {
                        const peer = createPeer(data.callerID, localMediaStream, false)
                        peer.signal(data.signal)
                    } else {
                        console.error('[VideoCall] Cannot answer call - no local stream yet')
                    }
                } else {
                    // Subsequent trickled signals - pass to existing peer
                    console.log('[VideoCall] Passing trickled signal to existing peer')
                    try {
                        peerRef.current.signal(data.signal)
                    } catch (err) {
                        console.error('[VideoCall] Error passing signal to peer:', err)
                    }
                }
            }
        })

        // Listen for returned signal (from answerer back to initiator)
        socketRef.current.on("receiving-returned-signal", (data) => {
            console.log('[VideoCall] Received returned signal from:', data.id)
            if (peerRef.current) {
                try {
                    peerRef.current.signal(data.signal)
                } catch (err) {
                    console.error('[VideoCall] Error signaling peer with answer:', err)
                }
            } else {
                console.error('[VideoCall] No peer reference to signal')
            }
        })

        // Listen for user disconnect
        socketRef.current.on("user-disconnected", (disconnectedSocketId) => {
            console.log('[VideoCall] User disconnected:', disconnectedSocketId)
            setIsConnected(false)
            setRemoteStream(null)
            if (peerRef.current) {
                peerRef.current.destroy()
                peerRef.current = null
            }
        })

        // Listen for call ended by other user
        socketRef.current.on("call-ended", () => {
            console.log('[VideoCall] Other user ended the call')
            setIsConnected(false)
            setRemoteStream(null)
            setIsCallEnded(true)
            if (peerRef.current) {
                peerRef.current.destroy()
                peerRef.current = null
            }
        })

        // Get user media (camera and microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                console.log('[VideoCall] Got local media stream')
                localMediaStream = stream
                localStreamRef.current = stream
                setLocalStream(stream)
                setIsLoading(false)

                // Join the room AFTER we have media and listeners are set up
                console.log('[VideoCall] Joining room:', appointmentId, 'with userId:', userId, 'as', userType)
                socketRef.current.emit("join-room", { appointmentId, userId, userType })
            })
            .catch(err => {
                console.error("Error accessing media devices:", err)
                setError("Could not access camera or microphone. Please check permissions.")
                setIsLoading(false)
            })

        // Cleanup on unmount
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop())
            }
            if (peerRef.current) {
                peerRef.current.destroy()
                peerRef.current = null
            }
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [appointmentId, userId, userType, backendUrl])

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                return audioTrack.enabled
            }
        }
        return false
    }

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                return videoTrack.enabled
            }
        }
        return false
    }

    const endCall = () => {
        console.log('[VideoCall] Ending call and notifying other user')
        
        // Notify other users in the room that we're ending the call
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('end-call', { appointmentId })
        }
        
        // Stop local media tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop()
                console.log('[VideoCall] Stopped track:', track.kind)
            })
        }
        
        // Destroy peer connection
        if (peerRef.current) {
            peerRef.current.destroy()
            peerRef.current = null
        }
        
        // Disconnect socket
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
        
        setLocalStream(null)
        setRemoteStream(null)
        setIsConnected(false)
    }

    return {
        localStream,
        remoteStream,
        isConnected,
        isLoading,
        isCallEnded,
        error,
        toggleAudio,
        toggleVideo,
        endCall
    }
}

export default useVideoCall
