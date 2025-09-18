import mongoose, { Document, Schema } from "mongoose";

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  role: "member" | "admin" | "moderator";
  status: "active" | "inactive";
  joinedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    role: {
      type: String,
      enum: ["member", "admin", "moderator"],
      default: "member",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Membership = mongoose.model<IMembership>("Membership", membershipSchema);
export default Membership;
