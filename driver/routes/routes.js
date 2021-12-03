import express from "express";
import * as Controller from "../controller/driver";
import { auth ,upload} from "@odd_common/common";
const router = express.Router();

router.post("/login", Controller.authGateWay);

router.post("/verify_otp", Controller.verifyOtp);

router.post("/update_profile", auth, Controller.completeProfile);

router.get("/toggle_mode", auth, Controller.toggleMode);

router.post("/upload_document", [auth,upload.single('file')], Controller.uploadDocument);

router.get("/logout", Controller.logout);

export default router;
