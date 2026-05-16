import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz API",
      version: "1.0.0",
      description: "REST API for quiz management, questions, and attempts.",
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Local development",
        variables: {
          port: { default: "5000" },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT from POST /api/auth/login or /api/auth/register",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../docs/openapi.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
