const express = require('express');
const router = express.Router();;
const { submitQuiz, getAllResults } = require('../controllers/quizController');

router.post('/submit', submitQuiz);
router.get('/results', getAllResults);

module.exports = router;