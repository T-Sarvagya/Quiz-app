/*const { readUsers, writeUsers } = require('../utils/fileUtils');
const RESULTS_FILE = 'data.json';*/
const fs = require('fs');
const path = require('path');
const Result = require('../models/Result');
const HttpStatus = require('../utils/httpStatus');

function calculateScore(answers) {
  const questionsPath = path.join(__dirname, "../questions.json");
  const allQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

  let score = 0;

  allQuestions.forEach((question, index) => {
    //const qId = `q${index +1}`;
    const qId = String(question.id);
    const submitted = answers[qId];
    //console.log(submitted);

    if (!submitted) return;

    if (question.type === "single") {
      if (submitted === question.answer) score++;

    } else if (question.type === "multiple") {
      if (Array.isArray(submitted)) {
        const correct = question.answer.sort().join(",");
        const userAns = submitted.sort().join(",");
        if (correct === userAns) score++;
      }

    } else if (question.type === "drag") {
      if (typeof submitted === "object") {
        let valid = true;
        for (let cat of question.categories) {
          const userValues = (submitted[cat] || []).sort().join(",");
          const expected = (question.answer[cat] || []).sort().join(",");
          if (userValues !== expected) {
            valid = false;
            break;
          }
        }
        if (valid) score++;
      }
    }
  });

  return score;
}




exports.submitQuiz = async (req, res) => {
   const { name, email, answers } = req.body;

   if (!name || !email || !answers) {
       return res.status(400).json({ message: "Missing data" });
   }

   try {
       const score = calculateScore(answers);
       const total = 5;
       const passed = score >= 3;
       const resultsPath = path.join(__dirname, "../data/results.json");

       let results = fs.existsSync(resultsPath)
         ? JSON.parse(fs.readFileSync(resultsPath, "utf-8"))
         : [];

       const index = results.findIndex(r => r.email === email);
       if (index !== -1) results[index] = { name, email, score };
       else results.push({ name, email, score });

       results.sort((a, b) => b.score - a.score);
       const rank = results.findIndex(r => r.email === email) + 1;

       fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

       res.status(200).json({ score, rank, passed });
   } catch (err) {
       console.error("Submit Error:", err);
       res.status(500).json({ message: "Submission failed" });
   }
};

exports.getAllResults = async (req, res) => {

    const resultsPath = path.join(__dirname, "../data/results.json");

  if (!fs.existsSync(resultsPath)) {
    return res.json([]);
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));

  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => {
    r.rank = i + 1;
    r.passed = r.score >= 3;
  });

  res.json(results);
  /*const filter = req.query.filter || "all";
  const now = Date.now();

  const timeLimits = {
    week: now - 7 * 24 * 60 * 60 * 1000,
    month: now - 30 * 24 * 60 * 60 * 1000,
    all: 0
  };

  const results = await Result.find({ timestamp: { $gte: timeLimits[filter] || 0 } }).sort({ score: -1, timestamp: 1 });

  results.forEach((r, i) => (r.rank = i + 1));
  res.json(results);*/
};

