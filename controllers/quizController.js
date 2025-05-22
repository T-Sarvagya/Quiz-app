/*const { readUsers, writeUsers } = require('../utils/fileUtils');
const RESULTS_FILE = 'data.json';*/
const Result = require('../models/Result');
const HttpStatus = require('../utils/httpStatus');

const correctAnswers = {
  ques1: 'a',
  ques2: 'b',
  ques3: 'c',
  ques4: ['React', 'Angular', 'Vue'],
  ques5: {
    Framework: ['React', 'Bootstrap'],
    Markup: ['HTML'],
    Style: ['CSS']
  }
};

// Helper to check single‐choice questions
function isRadioCorrect(submitted, correct) {
  return submitted === correct;
}

// Helper to check multiple‐choice questions
function isCheckboxCorrect(submitted, correctList) {
  if (!Array.isArray(submitted)) return false;
  const sortedSubmitted = [...submitted].sort().join(',');
  const sortedCorrect   = [...correctList].sort().join(',');
  return sortedSubmitted === sortedCorrect;
}

// Helper to check drag‐and‐drop matching questions
function isDragCorrect(submitted, correctMap) {
  if (typeof submitted !== 'object') return false;
  return Object.entries(correctMap).every(([category, correctItems]) => {
    const userItems    = (submitted[category] || []).sort().join(',');
    const sortedCorrect = [...correctItems].sort().join(',');
    return userItems === sortedCorrect;
  });
}

// Main score calculator
function calculateScore(answers) {
  let score = 0;

  for (const [que, correct] of Object.entries(correctAnswers)) {
    const submitted = answers[que];
    let isCorrect;

    if (Array.isArray(correct)) {
      // multi‐answer checkbox
      isCorrect = isCheckboxCorrect(submitted, correct);

    } else if (typeof correct === 'object') {
      // drag‐and‐drop matching
      isCorrect = isDragCorrect(submitted, correct);

    } else {
      // single‐choice radio
      isCorrect = isRadioCorrect(submitted, correct);
    }

    if (isCorrect) score++;
  }

  return score;
}


exports.submitQuiz = async (req, res) => {
  const { name, email, answers } = req.body;
  if (!name || !email || !answers) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing data" });
  }

  const score = calculateScore(answers);
  const timestamp = Date.now();
  const result = score >= 3 ? "Pass" : "Fail";

  try {
    //Upsert result (update if exists, insert if not)
    const updatedResult = await Result.findOneAndUpdate(
      { email },
      { name, email, score, result, timestamp },
      { upsert: true, new: true }
    );

    //Recalculate rank
    const allResults = await Result.find().sort({ score: -1, timestamp: 1 });
    allResults.forEach((r, i) => (r.rank = i + 1));

    const currentRank = allResults.find(r => r.email === email)?.rank;

    //Save updated rank
    await Result.updateOne({ email }, { rank: currentRank });

    res.json({
      name,
      email,
      score,
      result,
      rank: currentRank,
      timestamp
    });
  } catch (err) {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error saving result" });
  }
};

exports.getAllResults = async (req, res) => {
  const filter = req.query.filter || "all";
  const now = Date.now();

  const timeLimits = {
    week: now - 7 * 24 * 60 * 60 * 1000,
    month: now - 30 * 24 * 60 * 60 * 1000,
    all: 0
  };

  const results = await Result.find({ timestamp: { $gte: timeLimits[filter] || 0 } }).sort({ score: -1, timestamp: 1 });

  results.forEach((r, i) => (r.rank = i + 1));
  res.json(results);
};

/*exports.submitQuiz = (req, res) => {
  const { name, email, answers } = req.body;
  if (!name || !email || !answers || Object.keys(answers).length !== 5) {
    return res.status(400).json({ message: 'Incomplete submission' });
  }

  const score = calculateScore(answers);
  const timestamp = Date.now();
  const data = readUsers(RESULTS_FILE);
  const existing = data.findIndex(d => d.email === email);

  if (existing !== -1) data[existing] = { name, email, score, timestamp };
  else data.push({ name, email, score, timestamp });

  data.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
  data.forEach((d, i) => {
    d.rank = i + 1;
    d.result = d.score >= 3 ? 'Pass' : 'Fail';
  });

  writeUsers(RESULTS_FILE, data);
  res.json(data.find(d => d.email === email));
};

exports.getAllResults = (req, res) => {
  const data = readUsers(RESULTS_FILE);
  data.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
  data.forEach((d, i) => {
    d.rank = i + 1;
    d.result = d.score >= 3 ? 'Pass' : 'Fail';
  });
  res.json(data);
};*/
