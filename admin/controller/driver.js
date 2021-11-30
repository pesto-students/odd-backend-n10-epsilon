import { Driver } from "@odd_common/common";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};
export const getAllDriverList = async (req, res) => {
  try {
    const drivers = await Driver.getAllDriversList(req);
    let response = { ...defaultResponseObject };
    response.data = drivers;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
