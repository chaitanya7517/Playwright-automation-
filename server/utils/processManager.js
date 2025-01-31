const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const fs = require("fs");
const path = require("path");

let automationProcess = null;

exports.startProcess = (outputPath, url) => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const command = isWindows ? "npx.cmd" : "npx";
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (automationProcess) {
      treeKill(automationProcess.pid, "SIGINT", (err) => {
        if (err) return reject(err);
        automationProcess = null;
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
      automationProcess.on("error", () => {
        reject(new Error("Failed to start automation process"));
      });
      automationProcess.on("close", () => {
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
