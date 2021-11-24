import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  recommendation: {
    type: String,
  },
  base_fare: {
    type: Number,
  },
  per_km: {
    type: Number,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
});

schema.statics.create_vehicle = async ({
  name,
  image,
  recommendation,
  base_fare,
  per_km,
}) => {
  const vehicle = new Vehicle({
    name,
    image,
    recommendation,
    base_fare,
    per_km,
  });
  return await vehicle.save();
};

const Vehicle = mongoose.model("Vehicle", schema);

export default Vehicle;
