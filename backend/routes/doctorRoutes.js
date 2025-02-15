const express = require("express");
const { getDoctorPatients } = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:doctorId",     authMiddleware("doctor"), getDoctorPatients);

module.exports = router;