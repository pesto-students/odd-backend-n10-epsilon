import { User } from "@odd_common/common";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

export const getAllUsersList = async (req, res) => {
  try {
    const users = await User.getAllUsersList(req);
    let response = { ...defaultResponseObject };
    response.data = users;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
