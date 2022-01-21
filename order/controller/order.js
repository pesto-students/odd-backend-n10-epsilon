import { Vehicle, Order, otpGenerator, Driver } from "@odd_common/common";
import { createChannel, publishMessage } from "../amqplib/connection";
import Razorpay from "razorpay";
import crypto from "crypto";
import get_distance from "../helper/distance_bw_point";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

const channel = await createChannel();

const razorpay = new Razorpay({
  key_id: "rzp_test_AvZQq5684ArgeL",
  key_secret: "wsoguklWoerIuKiQcjIGosKf",
});

export const calculate_fare = async (req, res) => {
  try {
    const { latLong } = req.body;
    const result = await get_distance(latLong);
    const totalKm = result.distance.value / 1000;
    const vehicles = await Vehicle.find({}).lean();

    const charges = vehicles.map((vehicle) => ({
      ...vehicle,
      totalKm,
      estimate_fare: vehicle.base_fare + (totalKm - 4) * vehicle.per_km,
    }));

    let response = { ...defaultResponseObject };
    response.data = charges;
    response.message = "Charges fetched successfully";
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const getDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user_id")
      .populate("driver_id")
      .populate("vehicle_id");

    if (!order) throw new Error("Order not found");
    let response = { ...defaultResponseObject };
    response.data = order;
    response.message = "Order details fetched successfully";
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const create_order = async (req, res) => {
  const { vehicle_id, pickup_info, drop_off_info } = req.body;

  try {
    const latLong = {
      pickup: pickup_info.location.coordinates,
      dropoff: drop_off_info.location.coordinates,
    };
    const result = await get_distance(latLong);
    const distance = result.distance.value / 1000;

    const vehicle = await Vehicle.findById(vehicle_id).lean();
    if (!vehicle) throw new Error("No vehicle found");
    const fare = vehicle.base_fare + (distance - 4) * vehicle.per_km;

    const drop_off_otp = otpGenerator();
    const pickup_otp = otpGenerator();

    const payment_capture = 1;
    const amount = 499;
    const currency = "INR";

    const options = {
      amount: +fare.toFixed(0) * 100,
      currency,
      receipt: otpGenerator(),
      payment_capture,
    };
    // console.log(options);
    const razPayData = await razorpay.orders.create(options);

    const order = await Order.create({
      order_id: razPayData.id,
      vehicle_id,
      pickup_info,
      drop_off_info,
      distance: distance.toFixed(1),
      fare: fare.toFixed(0),
      drop_off_otp,
      pickup_otp,
      user_id: req.user._id,
    });
    let response = { ...defaultResponseObject };
    response.data = order;
    response.message = "Order created successfully";
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
export const verification = (req, res) => {
  // do a validation
  try {
    const secret = "12345678";
    // console.log(req.body);
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
      // console.log("request is legit");
      // process it
      const order_id = req.body.payload.payment.entity.order_id;
      Order.findAndUpdate({ order_id }, { payment_data: req.body });
    } else {
      // pass it
    }
    return res.json({ status: "ok" });
  } catch (error) {
    return res.json({ status: "ok" });
  }
};

export const update_order = async (req, res) => {
  try {
    const { status, otp, _id, coordinates } = req.body;
    if (!["inprogress", "delivered", "canceled"].includes(status))
      throw new Error("Invalid status");
    const order = await Order.findById(_id);
    if (
      order.status === "accepted" &&
      status === "inprogress" &&
      order.pickup_otp == otp
    ) {
      order.status = status;
    } else if (
      order.status === "inprogress" &&
      status === "delivered" &&
      order.drop_off_otp == otp
    ) {
      order.status = status;
      req.user.has_order = false;
    } else if (status === "canceled") {
      order.status = status;
    } else throw new Error("Invalid OTP");
    const track_history = {
      status: status,
      location: {
        type: "Point",
        coordinates: coordinates,
      },
    };

    order.track_history.push(track_history);
    await order.save();
    await req.user.save();
    const data = { room: order._id, data: order, event: "STATUS_CHANGE" };
    publishMessage(channel, "NEW_ORDER", JSON.stringify(data));
    let response = { ...defaultResponseObject };
    response.data = order;
    response.message = "Status changed successfully";
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const order_list = async (req, res) => {
  try {
    let where = {},
      data = req.query,
      sortBy = {};

    if (data.status === "live") {
      where.status = ["open", "accepted", "inprogress"];
    } else if (data.status === "past") {
      where.status = ["cancel", "delivered"];
    } else if (data.status) {
      where.status = data.status;
    }

    if (req.role === "user") where.user_id = req.user._id;
    if (req.role === "driver") where.driver_id = req.user._id;

    if (data.sort_field) {
      sortBy[data.sort_field] =
        data.order_by && data.order_by == "asc" ? 1 : -1;
    } else {
      sortBy.created_at = 1;
    }

    const orders = await Order.find(where)
      .populate({ path: "user_id", select: { mobile_number: 1 } })
      .populate({
        path: "driver_id",
        select: { mobile_number: 1, last_name: 1, first_name: 1 },
      })
      .populate("vehicle_id")
      .sort({ created_at: -1 })
      .lean();

    let response = { ...defaultResponseObject };
    response.data = orders;
    response.message = "Orders fetched successfully";
    return res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const findDriver = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!!");

    const [lat, long] = order.pickup_info.location.coordinates;
    let [driver] = await Driver.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lat), parseFloat(long)],
          },
          maxDistance: 9 * 1000,
          query: {
            isOnline: true,
            profile_completed: true,
            document_submitted: true,
            has_order: false,
          },
          distanceField: "distance",
          includeLocs: "dist.location",
          spherical: true,
        },
      },
    ])
      .sort({
        distance: 1,
      })
      .limit(1);

    if (driver) {
      order.driver_id = driver._id;
      order.status = "accepted";
      await order.save();
      await Driver.findByIdAndUpdate(driver._id, { has_order: true });
      const data = { room: driver._id, data: order, event: "NEW_ORDER" };
      publishMessage(channel, "NEW_ORDER", JSON.stringify(data));
    }
    let response = { ...defaultResponseObject };
    response.data = driver;
    response.message = driver ? "Find driver successfully" : "Driver not found";
    return res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
