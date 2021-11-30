import { Order } from "@odd_common/common";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};
export const getAllOrderList = async (req, res) => {
  try {
    const orders = await Order.getAllOrderList(req);
    let response = { ...defaultResponseObject };
    response.data = orders;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
