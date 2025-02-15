const express = require("express");
const { generateReport } = require("../controllers/patientController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/generate-report", authMiddleware("patient"), generateReport);

module.exports = router;
