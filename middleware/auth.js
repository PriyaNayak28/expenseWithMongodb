const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed: No token provided' });
        }

        const decodedToken = jwt.verify(token, '#@focus28ABCDabcd');
        console.log('userID >>>> ', decodedToken.userId);

        // Use Mongoose to find the user by ID
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed: User not found' });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Authentication failed: Invalid token' });
    }
}

module.exports = {
    authenticate
}
