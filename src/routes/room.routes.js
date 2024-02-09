import { Router } from "express";
import { verify_jwt } from "../middlewares/auth.middleware.js";
import {view_rooms, create_room} from '../controllers/room.controller.js'
const room_router=Router();
room_router.route("/create_room").post(verify_jwt,create_room)
room_router.route("/view_rooms").post(verify_jwt,view_rooms)
export default room_router