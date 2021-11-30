import express from "express";
import * as Controller from "../controller/auth";
import * as DriverController from "../controller/driver";
import * as UserController from "../controller/user";
import * as VehicleController from "../controller/vehicle";
import * as OrderController from "../controller/order";
import { auth } from "@odd_common/common";
const router = express.Router();

/* Post admin login. */
router.post("/login", Controller.login);

router.get("/logout", auth, Controller.logout);
router.get("/logoutAll", Controller.logoutAll);

router.get("/my_details", auth, Controller.myDetails);
router.get("/user_listing", auth, UserController.getAllUsersList);
router.get("/driver_listing", auth, DriverController.getAllDriverList);
router.get("/order_listing", auth, OrderController.getAllOrderList);
router.get("/vehicle_listing", auth, VehicleController.getAllVehicleList);

export default router;
