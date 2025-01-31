// server/controllers/automationController.js
const {
    initiateAutomation,
    terminateAutomation,
  } = require("../services/automationService");
  
  exports.startAutomation = async (req, res) => {
    const { url, filename, projectType, folder } = req.body;
    try {
      const result = await initiateAutomation(url, filename, projectType, folder);
      res.json(result);
    } catch (error) {
      console.error("Error starting automation:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.stopAutomation = async (req, res) => {
    try {
      await terminateAutomation();
      res.json({ message: "Automation stopped successfully" });
    } catch (error) {
      console.error("Error stopping automation:", error);
      res.status(500).json({ error: error.message });
    }
  };
  