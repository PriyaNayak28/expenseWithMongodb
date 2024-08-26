const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user'); // Mongoose User model
const Forgotpassword = require('../models/forgot-password'); // Mongoose Forgotpassword model

async function sendResetPasswordEmail(id) {
    const Client = Sib.ApiClient.instance;
    var apiKey = Client.authentications["api-key"];
    console.log(process.env.API_KEY);
    apiKey.apiKey = process.env.API_KEY;

    const sender = {
        email: "nayakpriya612@gmail.com",
    };

    const receivers = [
        {
            email: "pn6811754@gmail.com",
        },
    ];

    const transEmailApi = new Sib.TransactionalEmailsApi();

    const msg = {
        sender,
        to: receivers,
        subject: "Reset Password",
        text: "Reset your password",
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
    };

    return transEmailApi
        .sendTransacEmail(msg)
        .then((resp) => {
            console.log("Email sent successfully:", resp);
            return resp;
        })
        .catch((err) => {
            console.log("Email sending failed:", err);
            return err;
        });
}

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            const id = uuid.v4();
            const forgotPasswordRequest = new Forgotpassword({
                id,
                active: true,
                userId: user._id
            });

            await forgotPasswordRequest.save();
            await sendResetPasswordEmail(id);

            res.status(201).json({ success: true, message: 'Reset password email sent' });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}

const resetpassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotPasswordRequest = await Forgotpassword.findOne({ id });
        if (forgotPasswordRequest && forgotPasswordRequest.active) {
            forgotPasswordRequest.active = false;
            await forgotPasswordRequest.save();

            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset password</button>
                                    </form>
                                </html>`
            );
        } else {
            res.status(400).json({ message: 'Invalid or expired password reset request' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}

const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        const resetPasswordRequest = await Forgotpassword.findOne({ id: resetpasswordid });
        if (resetPasswordRequest) {
            const user = await User.findById(resetPasswordRequest.userId);
            if (user) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

                user.password = hashedPassword;
                await user.save();

                res.status(201).json({ message: 'Successfully updated the new password' });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(404).json({ error: 'Invalid password reset request', success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
};
