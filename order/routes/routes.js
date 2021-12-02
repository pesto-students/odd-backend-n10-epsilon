import express from "express";
import * as controller from "../controller/order";
import { auth } from "@odd_common/common";

const router = express.Router();

router.post("/calculate_fare", controller.calculate_fare);
router.post("/change_status", auth, controller.update_order);
router.post("/create", auth, controller.create_order);
router.get("/getOrder/:id", auth, controller.getDetails);

export default router;
