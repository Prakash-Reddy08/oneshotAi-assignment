const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require("../database/models/User")
const generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

const sendOTPByEmail = async (email, otp) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_ID,
            to: email,
            subject: 'OTP for Login',
            text: `Your OTP for login is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error sending OTP via email:', err);
        throw new Error('Failed to send OTP via email');
    }
};

exports.requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Enter valid email" });
        }

        const otp = generateOTP();

        const foundUser = await User.findOne({ email });

        if (foundUser) {
            foundUser.otp = otp;
            await foundUser.save();
        } else {
            const newUser = new User({ email, otp });
            await newUser.save();
        }

        await sendOTPByEmail(email, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error requesting OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(400).json({ error: "email not found" })
        }
        if (!foundUser.otp || foundUser.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const token = jwt.sign({ email, id: foundUser._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({
            id: foundUser._id
        },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )
        await User.findOneAndUpdate({ _id: foundUser._id },
            { refreshToken }
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ token, email, id: foundUser._id });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ error: 'Server error' });
    }
};