import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import useVideoCall from '../hooks/useVideoCall'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader, Maximize2, Minimize2, X } from 'lucide-react'

const VideoRoom = () => {
    const { appointmentId } = useParams()
    const navigate = useNavigate()
    const { backendUrl, userData, token } = useContext(AppContext)
    
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [isLocalVideoMinimized, setIsLocalVideoMinimized] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showEndCallConfirm, setShowEndCallConfirm] = useState(false)
    const [callEndedByOther, setCallEndedByOther] = useState(false)
    
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const containerRef = useRef(null)

    const userId = userData?._id
    const userType = 'patient'

    const {
        localStream,
        remoteStream,
        isConnected,
        isLoading,
        error,
        isCallEnded,
        toggleAudio,
        toggleVideo,
        endCall
    } = useVideoCall(appointmentId, userId, userType, backendUrl)

    // Set local video stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream
        }
    }, [localStream])

    // Set remote video stream
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
        }
    }, [remoteStream])

    // Redirect if not authenticated or no user data
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    // Detect when other user ends the call
    useEffect(() => {
        if (isCallEnded) {
            setCallEndedByOther(true)
            // Auto redirect after 3 seconds
            const timer = setTimeout(() => {
                navigate('/my-appointments')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isCallEnded, navigate])

    // Show loading while user data is being fetched
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <Loader className="w-16 h-16 animate-spin mx-auto mb-4" />
                    <p className="text-lg">Loading user data...</p>
                </div>
            </div>
        )
    }

    const handleToggleMute = () => {
        const audioEnabled = toggleAudio()
        setIsMuted(!audioEnabled)
    }

    const handleToggleCamera = () => {
        const videoEnabled = toggleVideo()
        setIsCameraOff(!videoEnabled)
    }

    const handleEndCall = () => {
        setShowEndCallConfirm(true)
    }

    const confirmEndCall = () => {
        endCall()
        navigate('/my-appointments')
    }

    const toggleLocalVideoSize = () => {
        setIsLocalVideoMinimized(!isLocalVideoMinimized)
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/my-appointments')}
                        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-gray-900 overflow-hidden">
            {/* Remote Video (Main View) */}
            <div className="absolute inset-0 z-0">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                            {isLoading ? (
                                <>
                                    <Loader className="w-16 h-16 animate-spin mx-auto mb-4" />
                                    <p className="text-lg">Initializing video call...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Video className="w-12 h-12" />
                                    </div>
                                    <p className="text-lg">Waiting for other participant to join...</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Local Video (Overlay with minimize/maximize) */}
            {localStream && !isLocalVideoMinimized && (
                <div className="absolute top-4 right-4 w-64 h-48 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/30 z-30 transition-all">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {isCameraOff && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <VideoOff className="w-12 h-12 text-white" />
                        </div>
                    )}
                    {/* Minimize Button */}
                    <button
                        onClick={toggleLocalVideoSize}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
                        title="Minimize"
                    >
                        <Minimize2 className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        You
                    </div>
                </div>
            )}

            {/* Minimized Local Video */}
            {localStream && isLocalVideoMinimized && (
                <div className="absolute top-4 right-4 w-16 h-16 bg-black rounded-full overflow-hidden shadow-2xl border-2 border-white/30 z-30 cursor-pointer hover:scale-110 transition-all"
                    onClick={toggleLocalVideoSize}
                    title="Maximize your video"
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {isCameraOff && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <VideoOff className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>
            )}

            {/* Top Bar with Status and Controls */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between">
                    {/* Connection Status */}
                    <div className="flex items-center gap-3">
                        {isConnected && (
                            <div className="bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                Connected
                            </div>
                        )}
                        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                            Session: {appointmentId.slice(-8)}
                        </div>
                    </div>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-5 h-5 text-white" />
                        ) : (
                            <Maximize2 className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Control Panel */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-center gap-6">
                    {/* Mute Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={handleToggleMute}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                isMuted
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-gray-700/90 hover:bg-gray-600 backdrop-blur-sm'
                            }`}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <MicOff className="w-7 h-7 text-white" />
                            ) : (
                                <Mic className="w-7 h-7 text-white" />
                            )}
                        </button>
                        <span className="text-white text-xs font-medium">{isMuted ? 'Unmute' : 'Mute'}</span>
                    </div>

                    {/* Camera Toggle Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={handleToggleCamera}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                isCameraOff
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-gray-700/90 hover:bg-gray-600 backdrop-blur-sm'
                            }`}
                            title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                        >
                            {isCameraOff ? (
                                <VideoOff className="w-7 h-7 text-white" />
                            ) : (
                                <Video className="w-7 h-7 text-white" />
                            )}
                        </button>
                        <span className="text-white text-xs font-medium">{isCameraOff ? 'Camera Off' : 'Camera'}</span>
                    </div>

                    {/* End Call Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={handleEndCall}
                            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-2xl hover:scale-110"
                            title="End Call"
                        >
                            <PhoneOff className="w-9 h-9 text-white" />
                        </button>
                        <span className="text-white text-xs font-medium">End Call</span>
                    </div>
                </div>
            </div>

            {/* End Call Confirmation Modal */}
            {showEndCallConfirm && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">End Consultation?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to end this video consultation?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEndCallConfirm(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmEndCall}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                            >
                                End Call
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Ended by Other User Modal */}
            {callEndedByOther && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PhoneOff className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Call Ended</h3>
                        <p className="text-gray-600 mb-4">The other participant has ended the consultation.</p>
                        <p className="text-sm text-gray-500">Redirecting in a moment...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoRoom
