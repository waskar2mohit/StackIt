const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();

        const token = jwt.sign({ id: user._id }, 'stackit_secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, 'stackit_secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;