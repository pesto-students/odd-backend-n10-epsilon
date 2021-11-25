import axios from "axios";
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
    const latLong = { pickup: [22.7465, 77.4788], dropoff: [22.7248, 75.9177] };
    const result = await get_distance(latLong);
    const totalKm = result.distance.value / 1000;
    const vehicles = await Vehicle.find({}).lean();

    const charges = vehicles.map((vehicle) => ({
      ...vehicle,
      totalKm,
      estimate_fare: vehicle.base_fare + (totalKm - 4) * vehicle.per_km,
    }));
    res.json(charges);
  } catch (error) {}
};

export const create_order = async (req, res) => {
  const { vehicle_id, pickup_info, drop_off_info } = req.body;

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
};
