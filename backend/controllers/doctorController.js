const Patient = require("../models/patientModel");

exports.getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    if (req.user._id !== doctorId) {
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    }
    const patients = await Patient.find({ doctorAssigned: doctorId }).select("-password");

    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};