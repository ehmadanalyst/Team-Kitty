const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true},
  password: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  expertise: { type: String, required: true }, // e.g., Cardiologist, Neurologist
  availableTimings: { type: String, required: true }, // e.g., "9 AM - 5 PM"
  contact: {type: String},
});

module.exports = mongoose.model("Doctor", doctorSchema);
