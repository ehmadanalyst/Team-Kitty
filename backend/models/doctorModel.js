const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  expertise: { type: String, required: true }, // e.g., Cardiologist, Neurologist
  availableTimings: { type: String, required: true }, // e.g., "9 AM - 5 PM"
  contact: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
