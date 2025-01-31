// server/utils/validation.js
const path = require("path");

const validProjectTypes = ["b2c", "b2b", "drx", "labs"];

exports.isValidProjectType = (projectType) => {
  return validProjectTypes.includes(projectType);
};

exports.getOutputPath = (projectType, folder, filename) => {
  return path.join(__dirname, "../../scripts", projectType, folder, filename);
};
