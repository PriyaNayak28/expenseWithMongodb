const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

// Route to initiate the purchase of a premium membership
// Requires user to be authenticated
router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasepremium);

// Route to update the transaction status after payment
// Requires user to be authenticated
router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
