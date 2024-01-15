import { Router } from "express";
import {register_user , login_user,logout_user} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verify_jwt } from "../middlewares/auth.middleware.js";
const router = Router();
router
  .route("/register")
  .post(upload.fields([{ name: "user_image", maxCount: 1 }]), register_user);
router.route("/login").post(login_user);
// secured routes
router.route("/logout").post(verify_jwt,logout_user)
export default router;
