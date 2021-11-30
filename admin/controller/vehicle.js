import { Vehicle } from "@odd_common/common";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

export const getAllVehicleList = async (req, res) => {
  try {
    const vehicle = await Vehicle.getAllVehicleList(req);
    let response = { ...defaultResponseObject };
    response.data = vehicle;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
