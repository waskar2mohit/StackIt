const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    votes: { type: Number, default: 0 },
    // Track usernames of people who voted to enforce "one vote per person"
    upvotedBy: { type: [String], default: [] },
    downvotedBy: { type: [String], default: [] },
    author: { type: String, default: 'Anonymous' },
    createdAt: { type: Date, default: Date.now },
    answers: [
        {
            text: String,
            author: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],

});

module.exports = mongoose.model('Question', QuestionSchema);