const express = require("express");
const { getDoctorPatients, addInstructions} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware("doctor"), getDoctorPatients);
router.post("/add-instruction", addInstructions);

module.exports = router;