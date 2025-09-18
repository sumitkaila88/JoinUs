import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
  price?: number;
  createdBy: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", eventSchema);
export default Event;
