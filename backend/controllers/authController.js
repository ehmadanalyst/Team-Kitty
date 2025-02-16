const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");

exports.register = async (req, res) => {
  console.log("Inside Register");
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;

  if (role === "patient") {
    user = new Patient({ name, email, password: hashedPassword, age: req.body.age, symptoms: req.body.symptoms || null });
  } else if (role.toLowerCase() === "doctor") {
    user = new Doctor({ name, email, password: hashedPassword, expertise: req.body.expertise, availableTimings: req.body.availableTimings });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  let user;

  if (role === "patient") {
    user = await Patient.findOne({ email });
  } else if (role === "doctor") {
    user = await Doctor.findOne({ email });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, uniqueId: user._id });
};
