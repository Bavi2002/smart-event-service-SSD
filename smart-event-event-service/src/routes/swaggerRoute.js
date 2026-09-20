import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load your OpenAPI YAML
const swaggerDocument = YAML.load(path.join(__dirname, "../../openapi.yaml"));

// Serve Swagger UI at /api-docs
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
