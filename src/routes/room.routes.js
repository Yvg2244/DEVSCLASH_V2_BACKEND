import { Router } from "express";
import { verify_jwt } from "../middlewares/auth.middleware.js";
import {create_room} from '../controllers/room.controller.js'
const room_router=Router();
room_router.route("/create_room").post(verify_jwt,create_room)
export default room_router