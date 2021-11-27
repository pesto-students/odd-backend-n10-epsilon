import { Driver ,Vehicle} from "../../common";
const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};

export const authGateWay = async (req, res) => {
  try {
    const driver = await Driver.findByCredentials(req.body.mobile_number);
    let response = { ...defaultResponseObject };
    response.data = driver;
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
    const driver = await Driver.userOtpVerify(req.body._id, req.body.otpVerify);
    const token = await driver.generateAuthToken();

    let response = { ...defaultResponseObject };
    response.data = driver;
    response.token = token;

    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const completeProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "first_name",
    "last_name",
    "email",
    "city",
    "state",
    "postal_code",
    "language",
    "password",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
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

export const uploadDocument = async (req, res) => {
  try {
    const { type } = req.body;
    const doc = { type, path: req.doc };
    console.log(req.user);
    req.user.doc.push(doc);
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

export const getVehicle =async (req, res) => {
  try {
    const vehicle = await Vehicle.find();
  let response = { ...defaultResponseObject };
    response.data = vehicle;
    return res.status(201).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }

}

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
