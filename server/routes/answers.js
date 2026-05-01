const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');

// @route   POST /api/answers
// @desc    Post a reply/answer to a question
router.post('/', async (req, res) => {
    const answer = new Answer({
        questionId: req.body.questionId,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newAnswer = await answer.save();
        res.status(201).json(newAnswer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   GET /api/answers/:questionId
// @desc    Get all answers for a specific question
router.get('/:questionId', async (req, res) => {
    try {
        const answers = await Answer.find({ questionId: req.params.questionId }).sort({ createdAt: -1 });
        res.json(answers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;