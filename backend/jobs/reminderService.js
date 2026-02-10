import cron from 'node-cron';
import appointmentModel from '../models/appointmentModel.js';
import transporter from '../config/emailConfig.js';

// Parse slotDate and slotTime to Date object
const parseAppointmentDateTime = (slotDate, slotTime) => {
    const [day, month, year] = slotDate.split('_').map(Number);
    const [time, period] = slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return new Date(year, month - 1, day, hours, minutes);
};

const sendDailyReminders = async () => {
    try {
        const now = new Date();
        const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);
        const thirteenHoursLater = new Date(now.getTime() + 13 * 60 * 60 * 1000);

        console.log(`[Reminder Service] Checking for appointments between ${twelveHoursLater.toLocaleString()} and ${thirteenHoursLater.toLocaleString()}`);

        const appointments = await appointmentModel.find({
            cancelled: false,
            isCompleted: false,
            reminderSent: false
        });

        if (appointments.length === 0) {
            console.log('[Reminder Service] No upcoming appointments need reminders.');
            return;
        }

        console.log(`[Reminder Service] Found ${appointments.length} total appointments to check.`);

        let remindersSent = 0;

        for (const appointment of appointments) {
            try {
                const appointmentDateTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime);
                
                // Check if appointment is between 12 and 13 hours from now
                if (appointmentDateTime >= twelveHoursLater && appointmentDateTime < thirteenHoursLater) {
                    const userEmail = appointment.userData.email;
                    const userName = appointment.userData.name;
                    const doctorName = appointment.docData.name;
                    const time = appointment.slotTime;
                    const date = appointment.slotDate.replace(/_/g, '/');

                    const mailOptions = {
                        from: process.env.SMTP_USER,
                        to: userEmail,
                        subject: 'Appointment Reminder - Therapy Co.',
                        text: `Hello ${userName},\n\nThis is a reminder for your upcoming appointment with Dr. ${doctorName} on ${date} at ${time} (in 12 hours).\n\nPlease ensure you are available.\n\nBest regards,\nTherapy Co.`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                                <h2 style="color: #a21caf;">Appointment Reminder</h2>
                                <p>Hello <strong>${userName}</strong>,</p>
                                <p>This is a reminder for your upcoming appointment with <strong>Dr. ${doctorName}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.</p>
                                <p style="color: #a21caf; font-weight: bold;">⏰ Your appointment is in 12 hours!</p>
                                <p>Please ensure you are available.</p>
                                <br/>
                                <p>Best regards,</p>
                                <p><strong>Therapy Co.</strong></p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`[Reminder Service] Email sent to ${userEmail}`);
                    
                    // Mark reminder as sent
                    await appointmentModel.findByIdAndUpdate(appointment._id, { reminderSent: true });
                    remindersSent++;
                }
            } catch (error) {
                console.error(`[Reminder Service] Error processing appointment ${appointment._id}:`, error);
            }
        }

        if (remindersSent > 0) {
            console.log(`[Reminder Service] Sent ${remindersSent} reminder(s).`);
        } else {
            console.log('[Reminder Service] No appointments found in the 12-hour window.');
        }

    } catch (error) {
        console.error('[Reminder Service] Error in daily reminder job:', error);
    }
};

// Schedule the task to run every hour
// Cron format: Minute Hour Day Month DayOfWeek
// 0 * * * * means every hour at minute 0
const startReminderService = () => {
    cron.schedule('0 * * * *', () => {
        console.log('[Reminder Service] Running hourly appointment check...');
        sendDailyReminders();
    });
    console.log('[Reminder Service] Hourly reminder job scheduled (checks for appointments 12 hours ahead).');
};

export { startReminderService, sendDailyReminders };
