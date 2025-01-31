// server/services/automationService.js
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const {
  isValidProjectType,
  getOutputPath,
} = require("../utils/validation");
const { startProcess, stopProcess } = require("../utils/processManager");

let automationProcess = null;

exports.initiateAutomation = async (url, filename, projectType, folder) => {
  // Validation
  if (!url || !filename || !projectType || !folder) {
    throw new Error("Missing required parameters");
  }
  if (!isValidProjectType(projectType)) {
    throw new Error("Invalid project type");
  }

  // Validate folder name (prevent directory traversal)
  const sanitizedFolder = path.basename(folder);
  if (sanitizedFolder !== folder) {
    throw new Error("Invalid folder name");
  }

  const outputPath = getOutputPath(projectType, sanitizedFolder, filename);

  // Start Automation
  automationProcess = await startProcess(outputPath, url);

  return {
    message: "Automation started successfully",
    filePath: path.join(projectType, sanitizedFolder, filename),
  };
};

exports.terminateAutomation = async () => {
  if (!automationProcess) {
    throw new Error("No active automation process");
  }
  await stopProcess(automationProcess);
  automationProcess = null;
};
