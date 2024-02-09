import { Router } from "express";
import { execute_code } from "../controllers/code.controller.js";
const code_router = Router();
code_router.route("/execute").post(execute_code);
export default code_router;