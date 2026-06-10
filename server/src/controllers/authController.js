const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({ name, email, password, phone, address, role: "user" });

  res.status(201).json({
    message: "Registration successful",
    user: publicUser(user),
    token: generateToken(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    message: "Login successful",
    user: publicUser(user),
    token: generateToken(user)
  });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    let admin = await User.findOne({ email });
    if (!admin) {
      admin = await User.create({
        name: "Marketplace Admin",
        email,
        password,
        role: "admin"
      });
    }

    return res.json({
      user: publicUser(admin),
      token: generateToken(admin)
    });
  }

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  res.json({
    user: publicUser(admin),
    token: generateToken(admin)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = { signup, login, adminLogin, me };
