const User = require('../models/user');
const Expense = require('../models/expense');

const getUserLeaderBoard = async (req, res) => {
    try {
        // Fetch all users and sort by totalExpenses in descending order
        const leaderboardofusers = await User.find().sort({ totalExpenses: -1 });

        res.status(200).json(leaderboardofusers);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
};
