const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const router = express.Router();

// Load Swagger YAML (go one level UP from src/)
const swaggerDocument = YAML.load(path.join(__dirname, "../../openapi.yaml"));

// Serve Swagger UI
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
