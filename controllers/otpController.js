import Otp from '../models/OtpModel.js';

// Generate OTP
export const generateOtp = async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const newOtp = new Otp({ otp });
        await newOtp.save();

        res.status(201).json({ success: true, message: 'OTP generated successfully', otp });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating OTP', error });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        const storedOtp = await Otp.findOne({ otp }).sort({ createdAt: -1 }).exec();

        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (storedOtp.expiresAt > new Date()) {
            await Otp.deleteOne({ _id: storedOtp._id });
            return res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying OTP', error });
    }
};
