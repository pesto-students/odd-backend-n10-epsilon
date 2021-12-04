import { Vehicle, Order, otpGenerator } from "@odd_common/common";
import get_distance from "../helper/distance_bw_point";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

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

    const order = await Order.create({
      vehicle_id,
      pickup_info,
      drop_off_info,
      distance,
      fare,
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

export const update_order = async (req, res) => {
  try {
    const { status, otp, _id, coordinates } = req.body;
    if (["inprogress", "delivered", "canceled"].includes(status))
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
    } else if (status === "canceled") {
      order.status = status;
    } else throw new Error("Invalid request");
    const track_history = {
      status: status,
      location: {
        type: "Point",
        coordinates: coordinates,
      },
    };
    order.track_history.push(track_history);
    await order.save();
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
      sortBy.created_at = -1;
    }
    const orders = await Order.find(where)
      .populate({ path: "user_id", select: { mobile_number: 1 } })
      .populate({ path: "driver_id", select: { last_name: 1, first_name: 1 } })
      .populate("vehicle_id")
      .sort(sortBy)
      .skip(parseInt(req.query.skip || 0))
      .limit(parseInt(req.query.limit || 10))
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
