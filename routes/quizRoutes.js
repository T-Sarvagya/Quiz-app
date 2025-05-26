const express = require('express');
const router = express.Router();
const getRandomQuestions = require('../utils/questionSelector');
const HttpStatus = require('../utils/httpStatus');
const { submitQuiz, getAllResults } = require('../controllers/quizController');

router.post('/submit', submitQuiz);
router.get('/results', getAllResults);
router.get('/random', (req,res) =>{
    try{
        const selected = getRandomQuestions(5);
        res.json(selected);
    }catch{
        console.error("Error loading questions: ", err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Unable to load quiz questions."})
    }
})

module.exports = router;