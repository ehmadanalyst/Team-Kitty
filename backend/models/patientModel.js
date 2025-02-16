const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  symptoms: { type: String },
  medicalHistory: { type: String },
  reports: [
    {
      content: { type: String, required: true }, // AI-generated report content
      date: { type: Date, default: Date.now },  // Timestamp for when the report was created
      instructions: { type: String, default: "" }, // Doctor's instructions
    }
  ],
  doctorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
});

module.exports = mongoose.model("Patient", patientSchema);
