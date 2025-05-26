const fs = require("fs");
const path = require("path");

function getRandomQuestions(count = 5) {
  const data = fs.readFileSync(path.join(__dirname, "../questions.json"), "utf-8");
  const questions = JSON.parse(data);

  const single = questions.filter(q => q.type === "single");
  const multiple = questions.filter(q => q.type === "multiple");
  const drag = questions.filter(q => q.type === "drag");

  const result = [];

  // Ensure at least 1 of each type
  if (single.length > 0) result.push(single[Math.floor(Math.random() * single.length)]);
  if (multiple.length > 0) result.push(multiple[Math.floor(Math.random() * multiple.length)]);
  if (drag.length > 0) result.push(drag[Math.floor(Math.random() * drag.length)]);

  // Fill remaining slots from any type
  const remaining = questions.filter(q => !result.includes(q));
  while (result.length < count && remaining.length > 0) {
    const index = Math.floor(Math.random() * remaining.length);
    result.push(remaining.splice(index, 1)[0]);
  }

  return result;
}

module.exports = getRandomQuestions;