import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    }
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
