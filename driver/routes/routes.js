import express from "express";
import * as Controller from "../controller/driver";
import { auth } from "@odd_common/common";
const router = express.Router();

router.post("/login", Controller.authGateWay);

router.post("/verify_otp", Controller.verifyOtp);

router.post("/update_profile", auth, Controller.completeProfile);

router.post("/upload_document", auth, Controller.uploadDocument);

router.get("/logout", Controller.logout);

export default router;
