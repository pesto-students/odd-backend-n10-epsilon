import express from "express";

const router = express.Router();

router.get("/admin", (req, res, next) => {
  res.send("admin");
});

export default router;
