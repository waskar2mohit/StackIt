const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// @route   GET /api/questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/questions
router.post('/', async (req, res) => {
    try {
        const question = new Question({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            author: req.body.author
        });
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PATCH /api/questions/:id/vote
// @desc    Smart voting: handles up, down, switch, and cancel
// @route   PATCH /api/questions/:id/vote
router.patch('/:id/vote', async (req, res) => {
    const { type, username } = req.body; 
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        // Check if user has already upvoted or downvoted
        const upIndex = question.upvotedBy.indexOf(username);
        const downIndex = question.downvotedBy.indexOf(username);

        if (type === 'up') {
            if (upIndex !== -1) {
                // Already upvoted? User is clicking it again to CANCEL the vote
                question.upvotedBy.splice(upIndex, 1);
            } else {
                // Not upvoted yet. Remove from downvotes if they were there
                if (downIndex !== -1) question.downvotedBy.splice(downIndex, 1);
                question.upvotedBy.push(username);
            }
        } else if (type === 'down') {
            if (downIndex !== -1) {
                // Already downvoted? User is clicking it again to CANCEL the vote
                question.downvotedBy.splice(downIndex, 1);
            } else {
                // Not downvoted yet. Remove from upvotes if they were there
                if (upIndex !== -1) question.upvotedBy.splice(upIndex, 1);
                question.downvotedBy.push(username);
            }
        }

        // The final vote count is always (Total Upvoters) - (Total Downvoters)
        question.votes = question.upvotedBy.length - question.downvotedBy.length;
        
        await question.save();
        
        // Return everything so the frontend can highlight the arrows
        res.json({ 
            votes: question.votes, 
            upvotedBy: question.upvotedBy, 
            downvotedBy: question.downvotedBy 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/answers', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const newAnswer = {
            text: req.body.text,
            author: req.body.author,
            createdAt: new Date()
        };

        // Push the new answer into the question's answers array
        question.answers.push(newAnswer);
        
        await question.save();
        res.json(question); // Return the updated question with the new answer
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;