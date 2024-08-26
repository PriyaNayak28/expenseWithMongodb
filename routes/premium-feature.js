const express = require('express');
const premiumFeatureController = require('../controllers/premium-feature');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

// Route to get the user leaderboard
// Requires user to be authenticated
router.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;
