const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const treeKill = require("tree-kill");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let automationProcess = null;
const validProjectTypes = ["b2c", "b2b", "drx", "labs"];

app.post("/api/start", async (req, res) => {
  const { url, filename, projectType } = req.body;

  // Validation
  if (!url || !filename || !projectType) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  if (!validProjectTypes.includes(projectType)) {
    return res.status(400).json({ error: "Invalid project type" });
  }

  const isWindows = process.platform === "win32";
  const command = isWindows ? "npx.cmd" : "npx";
  const outputDir = path.join(__dirname, "scripts", projectType);
  const outputPath = path.join(
    outputDir, 
    filename.endsWith('.spec.js') ? filename : `${filename.replace(/\.js$/, '')}.spec.js`
  );

  try {
    // Create directory if not exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Kill existing process if any
    if (automationProcess) {
      await new Promise((resolve, reject) => {
        treeKill(automationProcess.pid, "SIGINT", (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      automationProcess = null;
    }

    // Start new process
    automationProcess = spawn(
      command,
      ["playwright", "codegen", "--output", outputPath, url],
      {
        stdio: "inherit",
        shell: isWindows,
      }
    );

    automationProcess.on("error", (err) => {
      console.error("Process error:", err);
      res.status(500).json({ error: "Failed to start automation" });
    });

    automationProcess.on("close", (code) => {
      console.log(`Process exited with code ${code}`);
      automationProcess = null;
    });

    res.json({
      message: "Automation started successfully",
      filePath: outputPath,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to start automation process" });
  }
});

app.post("/api/stop", async (req, res) => {
  if (!automationProcess) {
    return res.status(400).json({ error: "No active automation process" });
  }

  try {
    await new Promise((resolve, reject) => {
      treeKill(automationProcess.pid, "SIGINT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    automationProcess = null;
    res.json({ message: "Automation stopped successfully" });
  } catch (error) {
    console.error("Failed to stop automation:", error);
    res.status(500).json({ error: "Failed to stop automation" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
