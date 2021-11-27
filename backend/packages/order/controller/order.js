import { Vehicle, Order, otpGenerator } from "../../common";
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
