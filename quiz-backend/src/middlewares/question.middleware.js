import multer from "multer";
import { body, param } from "express-validator";
import { requireAdmin, requireAuth } from "./auth.middleware.js";
import { handleValidation } from "./validate.middleware.js";

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const name = file.originalname?.toLowerCase() ?? "";
    const mimeOk =
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/octet-stream";
    if (mimeOk || name.endsWith(".xlsx") || name.endsWith(".xls")) cb(null, true);
    else cb(new Error("Only .xlsx or .xls files are allowed"));
  },
});

export function questionAdminChain() {
  return [requireAuth, requireAdmin];
}

export function questionCreateChain() {
  return [
    param("quizId").isMongoId(),
    body("question").isString().trim().notEmpty(),
    body("type").isIn(["single", "multiple"]),
    body("options").isArray({ min: 2 }),
    body("options.*").isString().trim().notEmpty(),
    body("correctAnswers").isArray({ min: 1 }),
    body("correctAnswers.*").isInt({ min: 0 }),
    handleValidation,
  ];
}

export function questionUpdateChain() {
  return [
    param("id").isMongoId(),
    body("question").optional().isString().trim().notEmpty(),
    body("type").optional().isIn(["single", "multiple"]),
    body("options").optional().isArray({ min: 2 }),
    body("correctAnswers").optional().isArray({ min: 1 }),
    handleValidation,
  ];
}

export function questionDeleteChain() {
  return [param("id").isMongoId(), handleValidation];
}

export function questionImportExcelChain() {
  return [
    param("quizId").isMongoId(),
    handleValidation,
    (req, res, next) => {
      excelUpload.single("file")(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || "Upload failed" });
        return next();
      });
    },
  ];
}
