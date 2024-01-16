import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));   
app.use(express.static("public"))  
app.use(cookieParser())


import user_router from '../routes/user.routes.js'
import room_router from "../routes/room.routes.js";
app.use("/api/v1/users",user_router)
app.use("/api/v1/rooms",room_router)
export { app };  
