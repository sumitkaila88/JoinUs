import mongoose, { Document, Schema } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const communitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Community = mongoose.model<ICommunity>("Community", communitySchema);
export default Community;
