import jwt from "jsonwebtoken";
import { config } from "../config";
import { Admin, User, Driver } from "../model";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.JWT_SECRET);

    console.log("====================================");
    console.log(decoded);
    console.log("====================================");

    var user;
    if (decoded.role === "user") {
      user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    }
    if (decoded.role === "driver") {
      user = await Driver.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
    }
    if (decoded.role === "admin") {
      user = await Admin.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({
      success: true,
      data: null,
      message: "Please authenticate.",
      error: null,
    });
  }
};

export default auth;
