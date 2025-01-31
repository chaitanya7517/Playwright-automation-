const path = require("path");
const { isValidProjectType, getOutputPath } = require("../utils/validation");
const { startProcess, stopProcess } = require("../utils/processManager");

let automationProcess = null;

exports.initiateAutomation = async (url, filename, projectType, folder) => {
  if (!url || !filename || !projectType || !folder) {
    throw new Error("Missing required parameters");
  }
  if (!isValidProjectType(projectType)) {
    throw new Error("Invalid project type");
  }
  const sanitizedFolder = path.basename(folder);
  if (sanitizedFolder !== folder) {
    throw new Error("Invalid folder name");
  }
  const outputPath = getOutputPath(projectType, sanitizedFolder, filename);
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
