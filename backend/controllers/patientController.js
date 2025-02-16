const axios = require("axios");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const sendEmail = require("../utils/emailService");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getSpecializationFromAI = async (symptoms) => {
  console.log("Inside getSpecializationFromAI")
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a medical AI that strictly returns only the most relevant medical specialization in one or two words." },
          { role: "user", content: `Given these symptoms: ${symptoms}, which doctor specialization should the patient visit? Reply with only the specialization name (e.g., Cardiologist, Neurologist, Dermatologist).` }
        ],
        max_tokens: 15, // Reduced token usage
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response of specialization: ", response);

    return response.data.choices[0]?.message.content.trim() || null;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return null;
  }
};

const assignDoctor = async (specialization) => {
  console.log("Inside AssignDoctor");
  try {
    const doctor = await Doctor.findOne({
      expertise: { $regex: new RegExp(`^${specialization}$`, "i") } // Case-insensitive search
    }).sort({ availableTimings: 1 });

    console.log("Doctor found:", doctor);
    return doctor || null;
  } catch (error) {
    console.error("Error finding doctor:", error);
    return null;
  }
};

exports.generateReport = async (req, res) => {
  console.log("Insider Generate Report");
  try {
    const { symptoms } = req.body;

    const patientId = req.user.id;

    // Fetch the patient and their reports
    const patient = await Patient.findById(patientId).select("-password");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const specialization = await getSpecializationFromAI(symptoms);
    if (!specialization) {
      return res.status(500).json({ error: "AI failed to determine specialization" });
    }

    console.log("Specialization inside generateReport: ", specialization);

    const doctor = await assignDoctor(specialization);
    console.log("Doctor: ", doctor);
    if (!doctor) {
      return res.status(404).json({ error: "No doctor available for this specialization" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a medical assistant providing short and concise reports." },
          { role: "user", content: `Generate a short medical report for a patient which will be sent to respective doctor. Age: ${patient.age}, Symptoms: ${patient.symptoms}. Keep it under 100 words.` }
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiGeneratedReport = response.data.choices[0]?.message.content.trim() || "Report generation failed.";

    // Add new report to patient's record
    patient.reports.push({
      content: aiGeneratedReport,
      date: new Date(),
    });

    patient.doctorAssigned = doctor._id;
    patient.symptoms = symptoms;
    await patient.save();

    // Send email to doctor
    // await sendEmail(
    //   doctor.email,
    //   "New Patient Report Assigned",
    //   `You have been assigned a new patient: ${patient.name}.\n\nAge: ${patient.age}\nSymptoms: ${patient.symptoms}`
    // );

    // // Send email to patient
    // await sendEmail(
    //   patient.email,
    //   "Your Medical Report",
    //   `Hello ${patient.name},\n\nYour medical report has been generated and assigned to Dr. ${doctor.name}.\nYou will be contacted soon for further details.`
    // );

    res.status(201).json({
      message: "Report generated successfully!",
      patientId: patient._id,
      assignedDoctor: doctor._id,
      specialization,
      report: aiGeneratedReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getPatientReports = async (req, res) => {
  console.log("Inside getPatientReports");
  try {
    // Get the patient ID from the decoded token
    const patientId = req.user.id;
    console.log("PatientID: ", patientId);

    // Fetch the patient and their reports
    const patient = await Patient.findById(patientId).select("-password");
    console.log("Patient: ", patient);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      patientId: patient._id,
      symptoms: patient.symptoms,
      reports: patient.reports,
      doctorAssigned: patient.doctorAssigned,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};