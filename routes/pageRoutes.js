const express = require('express');
const path = require('path');
const router = express.Router();

const pagesDir = path.join(__dirname, '../public/pages');

router.get('/', (req, res) => {
  res.sendFile(path.join(pagesDir, 'register.html'));
});
router.get('/login', (req, res) => {
  res.sendFile(path.join(pagesDir, 'login.html'));
});
router.get('/register', (req, res) => {
  res.sendFile(path.join(pagesDir, 'register.html'));
});
router.get('/questions', (req, res) => {
  res.sendFile(path.join(pagesDir, 'questions.html'));
});
router.get('/result', (req, res) => {
  res.sendFile(path.join(pagesDir, 'result.html'));
});
router.get('/all-results', (req, res) => {
  res.sendFile(path.join(pagesDir, 'all-results.html'));
});


module.exports = router;