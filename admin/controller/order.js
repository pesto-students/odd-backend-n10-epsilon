import { Order,Driver,User } from "@odd_common/common";

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

export const getCount = async (req, res) => {
 try{
const user = await User.countDocuments();
const order = await Order.countDocuments();
const driver = await Driver.countDocuments();
let response = { ...defaultResponseObject };
response.data = {user,order,driver};
res.status(200).send(response);
} catch (e) {
let response = { ...defaultResponseObject };
response.error = e.message || e;
response.success = false;
res.status(400).send(response);
}
}
