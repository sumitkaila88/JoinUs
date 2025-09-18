import { Request, Response } from "express";
import Payment from "../models/Payment";
import Razorpay from "razorpay";
import Stripe from "stripe";

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", communityId, eventId } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const payment = await Payment.create({
      userId: req.user?.id,
      communityId,
      eventId,
      amount,
      currency,
      status: "pending",
      provider: "razorpay",
      transactionId: order.id,
    });

    res.json({ order, paymentId: payment._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe
export const createStripePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", communityId, eventId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // in smallest currency unit
      currency,
      metadata: { communityId, eventId, userId: req.user?.id },
    });

    const payment = await Payment.create({
      userId: req.user?.id,
      communityId,
      eventId,
      amount,
      currency,
      status: "pending",
      provider: "stripe",
      transactionId: paymentIntent.id,
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentId: payment._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Update payment status
// @route   POST /api/payments/:id/status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
