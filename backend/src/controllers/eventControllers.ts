import { Request, Response } from "express";
import Event from "../models/Event";

// @desc    Create new event
// @route   POST /api/events
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, price, communityId } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      createdBy: req.user?.id,
      communityId,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all events (optionally filtered by community)
// @route   GET /api/events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.query;
    const filter: any = {};

    if (communityId) filter.communityId = communityId;

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .populate("communityId", "name");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("communityId", "name");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.remove();
    res.json({ message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
