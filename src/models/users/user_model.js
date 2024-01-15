import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const user_schema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    user_image: {
      type: String,
      required: true,
    },
    user_password: {
      type: String,
      required: [true, "Password is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    upcoming_contests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "new_room",
      },
    ],
    completed_contests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contest_history",
      },
    ],
    refresh_token:{
        type:String
    },
  },
  { timestamps: true }
);
user_schema.pre("save", async function (next) {
  if (!this.isModified("user_password")) return next();
  this.user_password = await bcrypt.hash(this.user_password, 10);
});

user_schema.methods.is_password_correct = async function (user_password) {
  return await bcrypt.compare(user_password, this.user_password);
};
user_schema.methods.generate_access_token = async function () {
  return jwt.sign(
    {
      user_id: this._id,
      user_name: this.user_name,
      user_email: this.user_email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
user_schema.methods.generate_refresh_token = async function () {
  return jwt.sign(
    {
      user_id: this._id,
      user_name: this.user_name,
      user_email: this.user_email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const user_model = mongoose.model("users", user_schema);
