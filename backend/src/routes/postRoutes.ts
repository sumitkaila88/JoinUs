import express from "express";
import { createPost, getPostsByCommunity, toggleLike, addComment } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/community/:communityId", getPostsByCommunity);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

export default router;
