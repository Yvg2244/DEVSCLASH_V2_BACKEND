import mongoose, { Schema } from "mongoose";
const contest_history_schema = new mongoose.Schema(
    {
        contest: [
            {
                created_by_user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users"
                },
                winner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users"
                },
                completed: {
                    type: String,
                    enum: ["Ongoing", "Completed", "Cancelled","Upcoming"],
                    default:"Upcoming",
                    required: true
                }
            }
        ],

    }
)
export const contest_history_model = mongoose.model("contest_history", contest_history_schema)