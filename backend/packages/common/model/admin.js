const mongoose = require("mongoose");
const { default: config } = require("../config");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

adminSchema.methods.toJSON = () => {
  const admin = this;
  const adminObject = admin.toObject();

  delete adminObject.password;
  delete adminObject.tokens;

  return adminObject;
};

// Hash the plain text password before saving
adminSchema.pre("save", async (next) => {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

adminSchema.methods.generateAuthToken = async () => {
  const admin = this;
  const token = jwt.sign(
    { _id: admin._id.toString(), role: "admin" },
    config.JWT_SECRET
  );

  admin.tokens = admin.tokens.concat({ token });
  await admin.save();

  return token;
};

adminSchema.statics.findByCredentials = async ({ email, password }) => {
  const admin = await admin.findOne({ email });
  if (!admin) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
