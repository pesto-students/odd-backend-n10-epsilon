import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { otpGenerator } from "../helper";

const doc = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "aadhar_card",
        "pan_card",
        "driving_licence",
        "vehicle_insurance",
        "registration_card",
      ],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approve", "reject"],
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const driverSchema = new mongoose.Schema(
  {
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
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    profile_completed: {
      type: Boolean,
      default: false,
    },
    otp_verify: {
      type: Number,
      trim: true,
      default: null,
    },
    document_submitted: { type: Boolean, default: false },
    address: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    driver_status: {
      type: String,
      default: "pending",
      enum: ["approve", "rejected", "pending"],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    doc: [doc],
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
  },
  { timestamps: true }
);

driverSchema.virtual("order", {
  ref: "Order",
  localField: "_id",
  foreignField: "driver_id",
});

driverSchema.methods.toJSON = function () {
  const driver = this;
  const driverObject = driver.toObject();

  delete driverObject.password;
  delete driverObject.tokens;

  return driverObject;
};

driverSchema.methods.generateAuthToken = async function () {
  const driver = this;
  const token = jwt.sign(
    { _id: driver._id.toString(), role: "driver" },
    config.JWT_SECRET
  );

  driver.tokens = driver.tokens.concat({ token });
  await driver.save();

  return token;
};

driverSchema.statics.findByCredentials = async (mobile_number) => {
  const driver = await DriverSchema.findOne({ mobile_number });
  const otp = otpGenerator();

  if (!driver) {
    const Driver = new DriverSchema({ mobile_number, otp_verify: otp });
    console.log(Driver);
    let data = await Driver.save();
    return data;
  }

  driver.otp_verify = otpGenerator();
  return await driver.save();
};

driverSchema.statics.userOtpVerify = async (id, otp) => {
  const driver = await DriverSchema.findOne({ _id: id, otp_verify: otp });
  if (!driver) {
    throw new Error("Invalid OTP");
  }
  driver.otp_verify = null;
  return await driver.save();
};

const DriverSchema = mongoose.model("Driver", driverSchema);

export default DriverSchema;
