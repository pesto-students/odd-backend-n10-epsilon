import express from "express";

const router = express.Router();

import { calculate_fare } from "../controller/order";

router.get("/calculate_fare", calculate_fare);

router.get("/order", (req, res, next) => {
  res.send(" hnb nh ");
});

export default router;
