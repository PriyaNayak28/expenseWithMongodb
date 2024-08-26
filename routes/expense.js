const express = require('express');
const expenseController = require('../controllers/expense');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

// Route to add a new expense
// Requires user to be authenticated
router.post('/add-expense', authenticatemiddleware.authenticate, expenseController.addExpense);

// Route to get paginated list of expenses
// Requires user to be authenticated
router.get('/get-expense/:page', authenticatemiddleware.authenticate, expenseController.getExpense);

// Route to delete an expense
// Requires user to be authenticated
router.delete('/delete-expense/:expenseid', expenseController.deleteExpense)





module.exports = router;
