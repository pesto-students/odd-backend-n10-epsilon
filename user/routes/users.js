import express from "express";
import * as Controller from "../controller/user";
import { auth } from "@odd_common/common";
const router = express.Router();

/* POST users on boarding. */
router.post("/login", Controller.authGateWay);

/* POST users on verify otp. */
router.post("/verify_otp", Controller.verifyOtp);

/* POST users on verify otp. */
router.get("/logout", auth, Controller.logout);

export default router;
