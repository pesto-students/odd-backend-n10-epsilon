import { User } from "../../common";
const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

export const authGateWay = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.mobile_number);
    let response = { ...defaultResponseObject };
    response.data = user;
    res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const user = await User.verifyUserOtp(req.body._id, req.body.otpVerify);
    const token = await user.generateAuthToken();

    let response = { ...defaultResponseObject };
    response.data = user;
    response.token = token;

    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    let response = { ...defaultResponseObject };
    response.data = req.user;
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
