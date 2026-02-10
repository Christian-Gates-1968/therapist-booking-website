import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    type: {
      type: String,
      enum: ["consultation-scheduled", "message", "appointment-reminder"],
      required: true,
    },
    message: { type: String, required: true },
    scheduledTime: { type: String, default: null },
    scheduledDate: { type: String, default: null },
    read: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
  },
  { minimize: false }
);

const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default notificationModel;
