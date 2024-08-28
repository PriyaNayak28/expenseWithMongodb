
const { type } = require('os');
const Expense = require('../models/expense');
const User = require('../models/user');
const mongoose = require('mongoose');

const addExpense = async (req, res, next) => {
    try {
        if (!req.body.category) {
            throw new Error('Category is mandatory');
        }

        const { expense, desc, category } = req.body;

        if (!expense || !expense?.length) {
            return res.status(400).json({ success: false, message: 'Parameters missing' });
        }

        const newExpense = new Expense({ expense, desc, category, userId: req.user._id });
        await newExpense.save();

        req.user.totalExpenses = (Number(req.user.totalExpenses) + Number(expense)).toString();
        await req.user.save();
        console.log(newExpense)
        res.status(201).json({ newExpenseDetail: newExpense });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getExpense = async (req, res, next) => {
    try {
        const pageSize = 2;
        const page = +req.params.page || 1;
        const totalItems = await Expense.countDocuments({ userId: req.user._id });

        const expenses = await Expense.find({ userId: req.user._id })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            allExpenses: expenses,
            currentPage: page,
            hasNextPage: pageSize * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / pageSize),
        });
    } catch (error) {
        console.log('Get expense is failing', error.message);
        res.status(500).json({ error: error.message });
    }
}

const deleteExpense = async (req, res) => {
    try {
        if (!req.params.expenseid) {
            return res.status(400).json({ err: 'ID is missing' });
        }

        const expenseId = req.params.expenseid;
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const userId = expense.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.totalExpenses = (Number(user.totalExpenses) - Number(expense.expense)).toString();
        await user.save();

        await Expense.deleteOne({ _id: expenseId });

        res.json({ message: 'Expense deleted and user totalExpenses updated' });
    } catch (err) {
        console.error('Error deleting expense:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
};


