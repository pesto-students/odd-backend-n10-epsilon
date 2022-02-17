import { Driver, Vehicle, Order, DriverStatics } from "@odd_common/common";
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

export const toggleMode = async (req, res) => {
  try {
    req.user.isOnline = !req.user.isOnline;
    req.user.save();
    let response = { ...defaultResponseObject };
    response.data = { isOnline: req.user.isOnline };
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
    "document_submitted",
    "vehicle_id",
    "city_postal_code",
    "languages",
    "password",
    "vehicle_number",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    req.user.profile_completed = true;
    await req.user.save();
    let response = { ...defaultResponseObject };
    response.data = req.user;
    return res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const updateCoordinates = async (req, res) => {
  try {
    const id = req.user._id;
    const coordinates = req.body.coordinates;
    const driver = await Driver.findByIdAndUpdate(id, {
      "location.coordinates": coordinates,
    });
    let response = { ...defaultResponseObject };
    response.data = null;
    return res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const getDetails = (req, res) => {
  try {
    let response = { ...defaultResponseObject };
    response.data = req.user;
    return res.status(201).send(response);
  } catch (e) {
    // console.log(2);
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { type } = req.body;
    if (type === "profile_photo") req.user.image = req.file.location;
    else {
      const index = req.user.doc.findIndex((doc) => doc.type === type);
      if (index === -1) {
        req.user.doc.push({ type, path: req.file.location });
      } else req.user.doc[index] = { type, path: req.file.location };
    }
    await req.user.save();
    let response = { ...defaultResponseObject };
    response.data = req.file.location;
    return res.status(201).send(response);
  } catch (e) {
    // console.log(2);
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      driver_id: req.user._id,
      status: ["open", "accepted", "inprogress"],
    });
    let response = { ...defaultResponseObject };
    response.data = order;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
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

export const getStatics = async (req, res) => {
  try {

    let state = DriverStatics.findOne({ driver_id: req.user._id })
    if (!state) {
      const order = await Order.find({ driver_id: req.user._id });

      const earning = order.reduce(
        (accumulator, order) => accumulator + order.fare,
        0
      );
      const distance = order.reduce(
        (accumulator, order) => accumulator + order.distance,
        0
      );
       state = DriverStatics.create({ driver_id: req.user._id, total_distance_travel: distance, total_earning: earning, number_of_trips: order.length })
    }

    let response = { ...defaultResponseObject };
    response.data = {
      earning: state.earning,
      distance:state.total_distance_travel,
      order: state.number_of_trips,
    };
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const tripAndPayments = async (req, res) => {
  try {
    const orders = await Order.find(
      { driver_id: req.user._id },
      { pickup_info: 1, drop_off_info: 1, fare: 1, createdAt: 1, distance: 1 }
    ).lean();

    const earning = orders.reduce(
      (accumulator, order) => accumulator + order.fare,
      0
    );
    const distance = orders.reduce(
      (accumulator, order) => accumulator + order.distance,
      0
    );

    let response = { ...defaultResponseObject };
    response.data = {
      earning: earning.toFixed(0),
      distance,
      orders,
      trips: orders.length,
    };
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};

export const logout = async (req, res) => {
  try {
    // console.log(req.user);
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
