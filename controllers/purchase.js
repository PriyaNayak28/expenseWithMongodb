const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const userController = require('./user');

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            const newOrder = new Order({ orderid: order.id, status: 'PENDING', userId: req.user._id });
            await newOrder.save();

            return res.status(201).json({ order, key_id: rzp.key_id });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderid: order_id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const updateOrder = order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const updateUser = User.findByIdAndUpdate(userId, { ispremiumuser: true });

        await Promise.all([updateOrder, updateUser]);

        return res.status(202).json({
            success: true,
            message: "Transaction Successful",
            token: userController.generateAccessToken(userId, undefined, true)
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
};
