import mongoose, { Schema } from "mongoose";
const new_room_schema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    no_of_question: {
      type: Number,
      required: true,
    },
    start_time: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    room_type: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    active_participants: {
      type: Number,
      enum: [0, 1, 2],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
export const new_room_model = mongoose.model("new_room", new_room_schema);
