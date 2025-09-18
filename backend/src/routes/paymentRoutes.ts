import express from "express";
import {
  createRazorpayOrder,
  createStripePaymentIntent,
  updatePaymentStatus,
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/razorpay", protect, createRazorpayOrder);
router.post("/stripe", protect, createStripePaymentIntent);
router.post("/:id/status", protect, updatePaymentStatus);

export default router;
