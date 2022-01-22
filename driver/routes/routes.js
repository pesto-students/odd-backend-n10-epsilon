import express from "express";
import * as Controller from "../controller/driver";
import { auth, upload } from "@odd_common/common";
const router = express.Router();

router.post("/login", Controller.authGateWay);

router.post("/verify_otp", Controller.verifyOtp);

router.post("/update_profile", auth, Controller.completeProfile);

router.get("/toggle_mode", auth, Controller.toggleMode);

router.get("/get_current_order", auth, Controller.getCurrentOrder);

router.get("/get_vehicle", auth, Controller.getAllVehicleList);

router.get("/my_details", auth, Controller.getDetails);

router.get("/my_statics", auth, Controller.getStatics);

router.get("/trip_and_payments", auth, Controller.tripAndPayments);

router.post("/update_coordinates", auth, Controller.updateCoordinates);

router.post(
  "/upload_document",
  [auth, upload.single("file")],
  Controller.uploadDocument
);

router.get("/logout", auth, Controller.logout);

export default router;
