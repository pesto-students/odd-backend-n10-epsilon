import { Admin } from "@odd_common/common";
const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};
export const login = async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    let response = { ...defaultResponseObject };
    response.data = { admin, token };
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(401).send(response);
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    let response = { ...defaultResponseObject };
    response.data = null;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
export const myDetails = (req, res) => {
  try {
    let response = { ...defaultResponseObject };
    response.data = req.user;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
export const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    let response = { ...defaultResponseObject };
    response.data = null;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
