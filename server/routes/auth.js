const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json('User not found!');

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json('Wrong credentials!');

        const accessToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const { password, ...info } = user._doc;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Should be true in production, but okay for local if using https or localhost specific handling
            sameSite: 'Strict'
        }).status(200).json({ ...info, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Logout
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('refreshToken', { sameSite: 'none', secure: true }).status(200).send('User logged out successfully!');
    } catch (err) {
        res.status(500).json(err);
    }
});

// Refresh Token
router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You are not authenticated!");

    // In a real app, you should check if refreshToken is in a DB whitelist/blacklist here

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        err && console.log(err);
        if (err) return res.status(403).json("Token is not valid!");

        const newAccessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.status(200).json({ accessToken: newAccessToken, ...user });
    });
});

// Old Refetch replaced by verify logic in frontend mostly, but sticking to pattern:
// We might not need 'refetch' if we use /refresh to get user info on load

module.exports = router;

