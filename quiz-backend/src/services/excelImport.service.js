import xlsx from "xlsx";

function normalizeHeader(cell) {
  return String(cell ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function mapRow(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    const key = normalizeHeader(h);
    obj[key] = row[i];
  });
  return obj;
}

function findHeaderRow(rows) {
  for (let i = 0; i < Math.min(rows.length, 20); i += 1) {
    const raw = rows[i].map((c) => normalizeHeader(c));
    if (raw.includes("question") && raw.includes("type") && raw.includes("correctanswers")) {
      return i;
    }
  }
  return 0;
}

/**
 * Parse Excel buffer. Expected columns (case-insensitive):
 * Question | Type | Option1 | Option2 | Option3 | Option4 | CorrectAnswers
 * CorrectAnswers: 1-based indexes, comma-separated for multiple (e.g. "1" or "1,3")
 */
export function parseQuestionSheet(buffer) {
  const wb = xlsx.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (!rows.length) return [];

  const headerRowIndex = findHeaderRow(rows);
  const headers = rows[headerRowIndex].map((c) => String(c ?? "").trim());
  const dataRows = rows.slice(headerRowIndex + 1);

  const questions = [];
  for (const row of dataRows) {
    if (!row || !row.length) continue;
    const r = mapRow(headers, row);
    const qText = String(r.question ?? "").trim();
    if (!qText) continue;

    const typeRaw = String(r.type ?? "").trim().toLowerCase();
    const type = typeRaw === "multiple" ? "multiple" : "single";

    const options = [r.option1, r.option2, r.option3, r.option4]
      .map((o) => String(o ?? "").trim())
      .filter(Boolean);

    if (options.length < 2) continue;

    const correctRaw = String(r.correctanswers ?? "").trim();
    const parts = correctRaw.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
    const oneBased = parts.map((p) => Number.parseInt(p, 10)).filter((n) => !Number.isNaN(n) && n >= 1);
    const correctAnswers = [...new Set(oneBased.map((n) => n - 1))].filter((idx) => idx >= 0 && idx < options.length);

    if (!correctAnswers.length) continue;
    if (type === "single" && correctAnswers.length > 1) {
      correctAnswers.splice(1);
    }

    questions.push({
      question: qText,
      type,
      options,
      correctAnswers: correctAnswers.sort((a, b) => a - b),
    });
  }

  return questions;
}
