import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  provider: "razorpay" | "stripe";
  transactionId: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    provider: { type: String, enum: ["razorpay", "stripe"], required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
