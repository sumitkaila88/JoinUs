import express from "express";
import authRoutes from "./authRoutes";
import communityRoutes from "./communityRoutes";
import eventRoutes from "./eventRoutes";
import postRoutes from "./postRoutes";
import paymentRoutes from "./paymentRoutes";


const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/communities", communityRoutes);
router.use("/events", eventRoutes);
router.use("/posts", postRoutes);
router.use("/payments", paymentRoutes);

export default router;
