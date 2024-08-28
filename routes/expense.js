
const express = require('express');
const expenseController = require('../controllers/expense');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense', authenticatemiddleware.authenticate, expenseController.addExpense);

router.get('/get-expense/:page', authenticatemiddleware.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:expenseid', authenticatemiddleware.authenticate, expenseController.deleteExpense);

module.exports = router;

