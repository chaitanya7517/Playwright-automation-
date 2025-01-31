// server/routes/automationRoutes.js
const express = require("express");
const router = express.Router();
const {
  startAutomation,
  stopAutomation,
} = require("../controllers/automationController");

// Start Automation
router.post("/start", startAutomation);

// Stop Automation
router.post("/stop", stopAutomation);

module.exports = router;
