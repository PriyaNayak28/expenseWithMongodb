const express = require('express');
const resetpasswordController = require('../controllers/reset-password');

const router = express.Router();

// Route to handle the password reset form
// This should be a GET request where users are redirected to enter their new password
router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword);

// Route to show the password reset form (i.e., the form to enter the new password)
// This route is usually used to show a form where users enter their new password
router.get('/resetpassword/:id', resetpasswordController.resetpassword);

// Route to handle the password reset request
// This should be a POST request to trigger the email sending process
router.post('/forgotpassword', resetpasswordController.forgotpassword);

module.exports = router;
