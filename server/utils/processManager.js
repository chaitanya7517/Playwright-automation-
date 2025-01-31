// server/utils/processManager.js
const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const fs = require("fs");
const path = require("path");

let automationProcess = null;

exports.startProcess = (outputPath, url) => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const command = isWindows ? "npx.cmd" : "npx";

    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Kill existing process if any
    if (automationProcess) {
      treeKill(automationProcess.pid, "SIGINT", (err) => {
        if (err) return reject(err);
        automationProcess = null;
        // Start new process after killing
        startNewProcess();
      });
    } else {
      startNewProcess();
    }

    function startNewProcess() {
      automationProcess = spawn(command, ["playwright", "codegen", "--output", outputPath, url], {
        stdio: "inherit",
        shell: isWindows,
      });

      automationProcess.on("error", (err) => {
        reject(new Error("Failed to start automation process"));
      });

      automationProcess.on("close", (code) => {
        console.log(`Automation process exited with code ${code}`);
        automationProcess = null;
      });

      resolve(automationProcess);
    }
  });
};

exports.stopProcess = (process) => {
  return new Promise((resolve, reject) => {
    treeKill(process.pid, "SIGINT", (err) => {
      if (err) return reject(new Error("Failed to stop automation process"));
      resolve();
    });
  });
};
