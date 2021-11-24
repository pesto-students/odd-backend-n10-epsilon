import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import { otpGenerator } from "../helper";
import config from "../config";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  mobile_number: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (value.toString().length !== 10) {
        throw new Error("Invalid mobile number");
      }
    },
  },
  otp_verify: {
    type: Number,
    //  unique: true,
    trim: true,
    default: null,
  },
  profile_completed: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
      },
      device_token: {
        type: String,
      },
    },
  ],
});

userSchema.virtual("order", {
  ref: "Order",
  localField: "_id",
  foreignField: "user_id",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: "user" },
    config.JWT_SECRET
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (mobile_number) => {
  const user = await User.findOne({ mobile_number });

  const otp = otpGenerator();
  // await sendMessage(otp, mobileNumber);

  if (!user) {
    const user = new User({ mobile_number, otp_verify: otp });
    return await user.save();
  }

  user.otp_verify = otp;
  return await user.save();
};

userSchema.statics.verify_user_otp = async (id, otp) => {
  const user = await User.findOne({ _id: id, otp_verify: otp });
  if (!user) {
    throw new Error("Invalid OTP");
  }
  user.otpVerify = null;
  return await user.save();
};

const User = mongoose.model("User", userSchema);

export default User;
