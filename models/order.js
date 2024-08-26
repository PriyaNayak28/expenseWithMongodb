const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
        required: true,
    },
    orderid: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
