import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
