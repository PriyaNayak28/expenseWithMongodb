const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expense: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
