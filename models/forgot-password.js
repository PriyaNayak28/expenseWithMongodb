const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    expiresby: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
