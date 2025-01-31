// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const automationRoutes = require("./routes/automationRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use Automation Routes
app.use("/api", automationRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
