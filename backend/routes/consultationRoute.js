import express from "express";
import {
  requestConsultation,
  scheduleConsultation,
  getUserNotifications,
  markNotificationRead,
  cancelScheduledConsultation,
} from "../controllers/consultationController.js";
import authUser from "../middlewares/authUser.js";
import authDoctor from "../middlewares/authDoctor.js";

const consultationRouter = express.Router();

// User routes
consultationRouter.post("/request", authUser, requestConsultation);
consultationRouter.post("/notifications", authUser, getUserNotifications);
consultationRouter.post("/mark-read", authUser, markNotificationRead);
consultationRouter.post("/cancel-scheduled", authUser, cancelScheduledConsultation);

// Doctor routes
consultationRouter.post("/schedule", authDoctor, scheduleConsultation);

export default consultationRouter;
