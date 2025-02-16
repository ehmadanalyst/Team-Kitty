const express = require("express");
const { generateReport, getPatientReports } = require("../controllers/patientController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/generate-report", authMiddleware("patient"), generateReport);
router.get("/reports", authMiddleware("patient"), getPatientReports);

module.exports = router;
