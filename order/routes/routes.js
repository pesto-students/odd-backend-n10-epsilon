import express from "express";
import * as controller from "../controller/order";
import { auth } from "@odd_common/common";

const router = express.Router();

router.post("/calculate_fare", auth, controller.calculate_fare);
router.post("/change_status", auth, controller.update_order);
router.post("/create", auth, controller.create_order);

export default router;
