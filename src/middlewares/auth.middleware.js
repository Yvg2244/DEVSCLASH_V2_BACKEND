import { user_model } from "../models/users/user_model.js";
import { api_error } from "../utils/api_error.js";
import async_handler from "../utils/async_handler.js";
import jwt from "jsonwebtoken";
export const verify_jwt = async_handler(async (req, res, next) => {
  // console.log("Verfify JWT")
  try {
    const token =
      req.cookies?.acess_token ||
      req.header("Authorization")?.replace("Bearer ", "");
      // console.log("step 1",req.cookies);
    if (!token) {
      throw new api_error(401, "Unauthorized Request");
    }
    const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("step 2.0",decoded_token);
    const user = await user_model
      .findById(decoded_token?.user_id)
      .select("-user_password -refresh_token");
    // console.log("step 2.1",user);
    if (!user) {
      throw new api_error(401, "Invalid Token");
    }
    req.user = user;
    // console.log("req.user",req.user);
    next();
  } catch (error) {
    throw new api_error(401, "Invalid Access Token");
  }
});
