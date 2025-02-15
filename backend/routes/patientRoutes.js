const express = require("express");
const { generateReport } = require("../controllers/patientController");
const router = express.Router();

router.post("/generate-report", generateReport);

module.exports = router;
