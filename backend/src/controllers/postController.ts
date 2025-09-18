import { Request, Response } from "express";
import Post from "../models/Post";

// @desc    Create a new post in a community
// @route   POST /api/posts
export const createPost = async (req: Request, res: Response) => {
  try {
    const { communityId, content, media } = req.body;

    const post = await Post.create({
      communityId,
      userId: req.user?.id,
      content,
      media,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get posts for a community
// @route   GET /api/posts/community/:communityId
export const getPostsByCommunity = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ communityId: req.params.communityId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user?.id as string;
    if (post.likes.includes(userId as any)) {
      // unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // like
      post.likes.push(userId as any);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: req.user?.id,
      text,
      createdAt: new Date(),
    } as any);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
