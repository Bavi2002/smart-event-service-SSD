import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    organizerId: { type: String, required: true },
  },
  { timestamps: true },
);

export default model("Event", eventSchema);
