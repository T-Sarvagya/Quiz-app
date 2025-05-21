const { readUsers, writeUsers } = require('../utils/fileUtils');
const RESULTS_FILE = 'data.json';

const correctAnswers = {
  q1: 'a',
  q2: 'b',
  q3: 'c',
  q4: ['React', 'Angular', 'Vue'],
  q5: {
    Framework: ['React', 'Bootstrap'],
    Markup: ['HTML'],
    Style: ['CSS']
  }
};

function calculateScore(answers) {
  let score = 0;
  for (let q in correctAnswers) {
    const correct = correctAnswers[q];
    const submitted = answers[q];

    if (Array.isArray(correct)) {
      if (!Array.isArray(submitted)) continue;
      if (submitted.sort().join(',') === correct.sort().join(',')) score++;
    } else if (typeof correct === 'object') {
      if (typeof submitted !== 'object') continue;
      let valid = true;
      for (let key in correct) {
        const a = (submitted[key] || []).sort().join(',');
        const b = correct[key].sort().join(',');
        if (a !== b) {
          valid = false;
          break;
        }
      }
      if (valid) score++;
    } else {
      if (submitted === correct) score++;
    }
  }
  return score;
}

exports.submitQuiz = (req, res) => {
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
};
