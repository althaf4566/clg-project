// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Function to generate a JWT token
const getAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @route   POST /api/auth/signup
// @desc    Register new user and return token
// @access  Public
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    // 1. Basic validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // 2. Check for existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ fullName, email, password });

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save user to database
        await user.save();

        // 5. Create JWT token and send response
        const token = getAuthToken(user.id);
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            msg: 'Registration successful!'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // 2. Check for user existence
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 4. Create JWT token and send response
        const token = getAuthToken(user.id);
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            msg: 'Login successful!'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;