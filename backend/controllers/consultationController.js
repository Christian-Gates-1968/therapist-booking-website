import doctorModel from "../models/doctorModel.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Request instant consultation with an available doctor
const requestConsultation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    // Get user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Find an online doctor
    const availableDoctor = await doctorModel.findOne({ isOnline: true });

    if (availableDoctor) {
      // Doctor is online - return doctor info and signal backend will emit socket event
      return res.json({
        success: true,
        status: "doctor-available",
        message: "Doctor found! Connecting...",
        doctor: {
          id: availableDoctor._id,
          name: availableDoctor.name,
          speciality: availableDoctor.speciality,
          socketId: availableDoctor.socketId,
        },
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
        },
      });
    } else {
      // No doctor online - create notification
      await notificationModel.create({
        userId: userData._id,
        doctorId: "pending",
        type: "message",
        message: `User ${userData.name} requested an instant consultation. Please schedule a time.`,
      });

      return res.json({
        success: true,
        status: "pending",
        message:
          "No doctors available for instant call. A doctor will suggest a time shortly.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Schedule consultation for later (doctor action)
const scheduleConsultation = async (req, res) => {
  try {
    const { userId, doctorId, scheduledDate, scheduledTime, message } =
      req.body;

    if (!userId || !doctorId || !scheduledDate || !scheduledTime) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Fetch user and doctor data
    const userData = await userModel.findById(userId).select('-password');
    const docData = await doctorModel.findById(doctorId).select('-password');

    if (!userData || !docData) {
      return res.json({ success: false, message: "User or Doctor not found" });
    }

    // Convert scheduledDate from YYYY-MM-DD to DD_MM_YYYY format
    const [year, month, day] = scheduledDate.split('-');
    const slotDate = `${day}_${month}_${year}`;

    // Create appointment for the scheduled consultation
    const appointment = await appointmentModel.create({
      userId,
      docId: doctorId,
      slotDate,
      slotTime: scheduledTime,
      userData: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        dob: userData.dob,
        image: userData.image,
      },
      docData: {
        _id: docData._id,
        name: docData.name,
        email: docData.email,
        speciality: docData.speciality,
        degree: docData.degree,
        experience: docData.experience,
        about: docData.about,
        fees: docData.fees,
        address: docData.address,
        image: docData.image,
      },
      amount: 0, // Free scheduled consultation
      date: Date.now(),
      payment: true, // Mark as paid (free service)
    });

    // Create notification for user
    const notification = await notificationModel.create({
      userId,
      doctorId,
      type: "consultation-scheduled",
      message:
        message ||
        `Your consultation has been scheduled for ${scheduledDate} at ${scheduledTime}`,
      scheduledDate,
      scheduledTime,
    });

    res.json({
      success: true,
      message: "Consultation scheduled successfully",
      notification,
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    await notificationModel.findByIdAndUpdate(notificationId, { read: true });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel scheduled consultation (delete notification)
const cancelScheduledConsultation = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.json({ success: false, message: "Notification ID required" });
    }

    await notificationModel.findByIdAndDelete(notificationId);

    res.json({ success: true, message: "Scheduled consultation cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  requestConsultation,
  scheduleConsultation,
  getUserNotifications,
  markNotificationRead,
  cancelScheduledConsultation,
};
