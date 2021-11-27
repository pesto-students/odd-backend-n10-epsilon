import express from "express";
import * as Controller from "../controller/driver";
import {auth}from '../../common'
const router = express.Router();

/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
