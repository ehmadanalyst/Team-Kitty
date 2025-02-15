const axios = require("axios");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const sendEmail = require("../utils/emailService");

const getSpecializationFromAI = async (symptoms) => {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/completions",
      {
        model: "deepseek-medicine",
        prompt: `Given the following symptoms: ${symptoms}, suggest the most relevant medical specialization.`,
        max_tokens: 50,
      },
      {
        headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
      }
    );

    return response.data.choices[0]?.text.trim() || null;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return null;
  }
};

const assignDoctor = async (specialization) => {
    try {
      const doctor = await Doctor.findOne({ expertise: specialization }).sort({ availableTimings: 1 });
      return doctor ? doctor : null;
    } catch (error) {
      console.error("Error finding doctor:", error);
      return null;
    }
  };

exports.generateReport = async (req, res) => {
  try {
    const { name, age, symptoms, medicalHistory } = req.body;

    const specialization = await getSpecializationFromAI(symptoms);
    if (!specialization) {
      return res.status(500).json({ error: "AI failed to determine specialization" });
    }

    const doctor = await assignDoctor(specialization);

    const response = await axios.post(
      "https://api.deepseek.com/v1/completions",
      {
        model: "deepseek-medicine",
        prompt: `Age: ${age}, Symptoms: ${symptoms}, Medical History: ${medicalHistory}. Generate a detailed medical report.`,
        max_tokens: 300,
      },
      {
        headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
      }
    );

    const aiGeneratedReport = response.data.choices[0]?.text.trim() || "Report generation failed.";
    // 🔄 4️⃣ Store Report & Handle Multiple Reports
    let patient = await Patient.findOne({ name });

    if (!patient) {
      // Create new patient if not found
      patient = new Patient({
        name,
        age,
        symptoms,
        medicalHistory,
        reports: [],
        doctorAssigned: doctor._id,
      });
    }

    // Push new report into array
    patient.reports.push({
      content: aiGeneratedReport,
      date: new Date(),
    });

    // Send email to the assigned doctor
    await sendEmail(
        doctor.email,
        "New Patient Report Assigned",
        `You have been assigned a new patient: ${patient.name} - ${patient.uniqueId}.\n
         Age: ${patient.age}\n
         Symptoms: ${patient.symptoms}\n
         Medical History: ${patient.medicalHistory}`
      );
  
    // Send email to the patient
    await sendEmail(
        patient.email, // Assuming username is the email
        "Your Medical Report",
        `Hello ${patient.name},\n\n
            Your medical report has been generated and assigned to Dr. ${doctor.name}.\n
            You will be contacted soon for further details.`
    );

    res.status(201).json({
      message: "Report generated successfully!",
      patientId: patient._id,
      assignedDoctor: assignedDoctorId,
      specialization,
      report: aiGeneratedReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
