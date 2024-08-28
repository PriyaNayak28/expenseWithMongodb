const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const userController = require('./user');
require('dotenv').config();
const mongoose = require('mongoose');
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const { generateAccessToken } = require('./user');

const purchasepremium = async (req, res) => {
    try {
        console.log("controllers.purchasepremium 1");

        var rzp = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        });

        console.log(rzp.key_id, "controllers.purchasepremium 2", rzp.key_secret);
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ message: 'Razorpay error', error: err });
            }

            const newOrder = new Order({
                paymentId: order.id,
                orderId: order.id,
                status: "PENDING",
                user: req.user._id,
            });

            try {
                await newOrder.save();
                await User.findByIdAndUpdate(req.user._id, { $push: { orders: newOrder._id } });

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (error) {
                return res.status(500).json({ message: 'Database error', error });
            }
        });
    } catch (err) {
        console.error("General error:", err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentId = payment_id;
        order.status = 'SUCCESSFUL';

        try {

            const userId = req.user._id.toString()
            console.log(req.user._id, "req.user._id",)
            await order.save();
            await User.findByIdAndUpdate(userId, { isPremiumUser: true });

            return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: generateAccessToken(req.user._id, undefined, true, true),
            });
        } catch (error) {
            throw new Error(error);
        }
    } catch (err) {
        console.error("General error:", err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatus
}

