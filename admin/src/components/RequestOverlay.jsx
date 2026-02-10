import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, X, Calendar } from 'lucide-react'

const RequestOverlay = ({ request, onAccept, onDecline, onSchedule, doctorId }) => {
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [scheduledDate, setScheduledDate] = useState('')
    const [scheduledTime, setScheduledTime] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const navigate = useNavigate()

    // Generate available time slots based on selected date
    const generateTimeSlots = (selectedDate) => {
        const allSlots = [
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
            '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
            '07:00 PM', '07:30 PM', '08:00 PM'
        ]

        // If no date selected, return all slots
        if (!selectedDate) return allSlots

        const today = new Date()
        const selected = new Date(selectedDate)
        
        // If selected date is today, filter out past times
        if (selected.toDateString() === today.toDateString()) {
            const currentHour = today.getHours()
            const currentMinute = today.getMinutes()
            
            return allSlots.filter(slot => {
                const [time, period] = slot.split(' ')
                const [hours, minutes] = time.split(':').map(Number)
                let slotHour = hours
                
                // Convert to 24-hour format
                if (period === 'PM' && hours !== 12) slotHour += 12
                if (period === 'AM' && hours === 12) slotHour = 0
                
                // Check if slot is in future
                if (slotHour > currentHour) return true
                if (slotHour === currentHour && minutes > currentMinute) return true
                return false
            })
        }
        
        // For future dates, return all slots
        return allSlots
    }

    // Update available slots when date changes
    const handleDateChange = (e) => {
        const newDate = e.target.value
        setScheduledDate(newDate)
        setScheduledTime('') // Reset time when date changes
        setAvailableSlots(generateTimeSlots(newDate))
    }

    const handleAccept = () => {
        // Generate unique meeting ID
        const meetingId = `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        onAccept(request.userSocketId, meetingId)
        navigate(`/video-call/${meetingId}`)
    }

    const handleScheduleLater = () => {
        setShowScheduleModal(true)
    }

    const handleConfirmSchedule = () => {
        if (!scheduledDate || !scheduledTime) {
            alert('Please select both date and time')
            return
        }
        onSchedule({
            userId: request.userId,
            doctorId,
            scheduledDate,
            scheduledTime,
            userSocketId: request.userSocketId
        })
        setShowScheduleModal(false)
    }

    const handleDecline = () => {
        onDecline(request.userSocketId)
    }

    return (
        <>
            {/* Main Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Incoming Consultation Request
                                </h3>
                                <p className="text-sm text-gray-500">Instant call requested</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="mb-2">
                            <span className="text-gray-600 text-sm font-medium">Patient:</span>
                            <p className="text-gray-900 font-semibold text-lg">{request.userName}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm font-medium">Email:</span>
                            <p className="text-gray-700">{request.userEmail}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Join Call
                        </button>
                        <button
                            onClick={handleScheduleLater}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            Schedule Later
                        </button>
                    </div>

                    <button
                        onClick={handleDecline}
                        className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        Decline
                    </button>
                </div>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Schedule Consultation</h3>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={scheduledDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time {scheduledDate && availableSlots.length === 0 && <span className="text-red-500 text-xs">(No slots available for today)</span>}
                                </label>
                                <select
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    disabled={!scheduledDate || availableSlots.length === 0}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">{!scheduledDate ? 'Select a date first' : 'Choose a time'}</option>
                                    {availableSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmSchedule}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                                >
                                    Confirm Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
            `}</style>
        </>
    )
}

export default RequestOverlay
