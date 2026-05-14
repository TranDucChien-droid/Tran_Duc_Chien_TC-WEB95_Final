function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

export function scoreAttempt(questions, answers) {
  const byId = new Map(questions.map((q) => [String(q._id), q]));
  let correct = 0;
  for (const q of questions) {
    const ans = answers.find((a) => String(a.questionId) === String(q._id));
    const selected = ans?.selectedIndexes ?? [];
    if (arraysEqual(selected, q.correctAnswers)) correct += 1;
  }
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 10000) / 100;
  return { score, correct, total };
}
