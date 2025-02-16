const Patient = require("../models/patientModel");

exports.getDoctorPatients = async (req, res) => {
  console.log("Inside getDoctorPatients");
  try {
    const doctorId = req.user.id;

    const patients = await Patient.find({ doctorAssigned: doctorId }).select("-password");
    console.log("Patients: ", patients);

    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addInstructions = async (req, res) => {
  try {
    const { patientId, reportId, instruction } = req.body;

    if (!patientId || !reportId || !instruction) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find the specific report by reportId
    const report = patient.reports.find((r) => r._id.toString() === reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Add instruction to the report
    report.instructions = instruction;

    // Save the updated patient record
    await patient.save();

    res.status(200).json({ message: "Instruction added successfully", report });
  } catch (error) {
    console.error("Error adding instruction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}