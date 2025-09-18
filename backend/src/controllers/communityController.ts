import { Request, Response } from "express";
import Community from "../models/Community";
import Membership from "../models/Membership";

// @desc    Create new community
// @route   POST /api/communities
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const communityExists = await Community.findOne({ name });
    if (communityExists) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user?.id,
      members: [req.user?.id],
    });

    // auto-add creator as admin in membership
    await Membership.create({
      userId: req.user?.id,
      communityId: community._id,
      role: "admin",
      status: "active",
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all communities
// @route   GET /api/communities
export const getCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await Community.find().populate("createdBy", "name email");
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get single community
// @route   GET /api/communities/:id
export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
    if (!community) return res.status(404).json({ message: "Community not found" });

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Join a community
// @route   POST /api/communities/:id/join
export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.members.includes(req.user?.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    community.members.push(req.user?.id as any);
    await community.save();

    await Membership.create({
      userId: req.user?.id,
      communityId: community._id,
      role: "member",
    });

    res.json({ message: "Joined community successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Leave a community
// @route   POST /api/communities/:id/leave
export const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter(
      (member) => member.toString() !== req.user?.id
    );
    await community.save();

    await Membership.findOneAndDelete({
      userId: req.user?.id,
      communityId: req.params.id,
    });

    res.json({ message: "Left community successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
