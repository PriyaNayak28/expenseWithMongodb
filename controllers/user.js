const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    return !string || string.trim().length === 0;
}

// Signup controller
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'Successfully created new user' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate JWT token
const generateAccessToken = (id, name, isPremiumUser) => {
    return jwt.sign({ userId: id, name, isPremiumUser }, '#@focus28ABCDabcd');
};

// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email or Password is missing', success: false });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = generateAccessToken(user._id, user.name, user.isPremiumUser);
            res.status(200).json({ success: true, message: 'User logged in successfully', token });
        } else {
            res.status(400).json({ success: false, message: 'Password is incorrect' });
        }

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = {
    signup,
    login,
    generateAccessToken
};
