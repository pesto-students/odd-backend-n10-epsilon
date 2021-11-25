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

(async () => {
  const count = await Vehicle.countDocuments();
  if (count) return;
  Vehicle.insertMany([
    {
      name: "Two Wheeler",

      recommendation: "Recommended for Documents, Lunchbox etc.",
      base_fare: 100,
      per_km: 25,
    },
    {
      name: "Three Wheeler",

      recommendation:
        "Recommended for Large items like small Furniture, appliances etc.",
      base_fare: 100,
      per_km: 25,
    },
    {
      name: "Mini truck",

      recommendation:
        "Recommended for Large items like small Furniture, appliances etc.",
      base_fare: 100,
      per_km: 25,
    },
  ]);
  console.log(count);
})();
export default Vehicle;
