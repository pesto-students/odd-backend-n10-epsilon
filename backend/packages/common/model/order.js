import mongoose from "mongoose";
const location = new mongoose.Schema({
  add_1: {
    type: String,
    default: "",
  },
  add_2: {
    type: String,
    default: "",
  },
  contact_person_name: {
    type: String,
    default: "",
  },
  contact_person_number: {
    type: String,
    default: "",
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  instruction: {
    type: String,
    default: "",
  },
});

const track_history = new mongoose.Schema(
  {
    status: {
      type: String,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      default: "",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    status: {
      type: String,
      default: "open",
      enum: [
        "open",
        "accepted",
        "arrived",
        "inprogress",
        "cancel",
        "delivered",
      ],
    },

    track_history: [track_history],
    pickup_info: location,
    drop_off_info: location,

    fare: {
      type: Number,
    },
    driver_distance: {
      type: Number,
    },
    payment_status: {
      type: Boolean,
      default: false,
    },
    payment_data: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.statics.create_order = () => {};

const OrderSchema = mongoose.model("Order", orderSchema);

export default OrderSchema;
