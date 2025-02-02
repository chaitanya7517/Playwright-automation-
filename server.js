const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const treeKill = require("tree-kill");
const fs = require("fs");
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const reportPath = path.join(__dirname, "playwright-report");
app.use("/playwright-report", express.static(reportPath));

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

// Add these new endpoints after the existing endpoints

app.get("/api/tests", (req, res) => {
  const scriptsDir = path.join(__dirname, "scripts");
  const projectTypes = validProjectTypes;

  const testStructure = [];

  projectTypes.forEach(projectType => {
    const projectDir = path.join(scriptsDir, projectType);
    if (fs.existsSync(projectDir)) {
      const files = fs.readdirSync(projectDir)
          .filter(file => file.endsWith('.spec.js'))
          .map(file => ({
            name: file,
            path: path.join(projectType, file)
          }));

      testStructure.push({
        projectType,
        files
      });
    }
  });

  res.json(testStructure);
});

app.post("/api/run", async (req, res) => {
  const { files } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Invalid files parameter" });
  }

  const isWindows = process.platform === "win32";
  const command = isWindows ? "npx.cmd" : "npx";
  const testPaths = files.map(filePath =>
      path.join("scripts", filePath)
  );

  try {
    const args = ["playwright", "test", ...testPaths];

    const testProcess = spawn(command, args, {
      stdio: "pipe",
      shell: isWindows
    });

    let output = '';

    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    testProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    testProcess.on('close', (code) => {
      res.json({
        success: code === 0,
        exitCode: code,
        output
      });
    });

  } catch (error) {
    console.error("Error running tests:", error);
    res.status(500).json({ error: "Failed to execute tests" });
  }
});

// Get list of available projects
app.get('/api/projects', (req, res) => {
  res.json(validProjectTypes);
});

// Get list of files in a project
app.get('/api/files/:projectType', (req, res) => {
  const { projectType } = req.params;
  if (!validProjectTypes.includes(projectType)) {
    return res.status(400).json({ error: 'Invalid project type' });
  }

  const projectPath = path.join(__dirname, 'scripts', projectType);

  fs.readdir(projectPath, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]); // Return empty array if directory doesn't exist
      }
      return res.status(500).json({ error: 'Error reading directory' });
    }

    const specFiles = files.filter(file => file.endsWith('.spec.js'));
    res.json(specFiles);
  });
});

app.post("/api/run-tests", (req, res) => {
  const { files } = req.body;
  if (!files || !files.length) {
    return res.status(400).json({ error: "No files selected" });
  }

  const command = `npx playwright test ${files.join(" ")} --reporter=html`;
  const results = { output: "", error: "" };

  const child = exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) results.error = error.message;
    results.output = stdout;
    results.error = stderr;
  });

  child.on("exit", () => res.json(results));
});

// Endpoint to get the report URL
app.get("/api/show-report", (req, res) => {
  try {
    // Ensure the report directory exists
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({ error: "Report not found. Run tests first." });
    }

    // Return the URL to the report
    res.json({
      reportUrl: `http://localhost:63342/Playwright-automation-/playwright-report/index.html`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});