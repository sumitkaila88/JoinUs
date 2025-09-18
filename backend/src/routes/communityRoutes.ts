import express from "express";
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
} from "../controllers/communityController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getCommunities);
router.get("/:id", getCommunityById);
router.post("/", protect, createCommunity);
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);

export default router;
