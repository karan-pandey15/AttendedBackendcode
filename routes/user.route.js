import express from "express";
import {
  getUserData,
  initiateForgotPasswordForUser,
  loginUser,
  logoutUser,
  orderProduct, 
  otpVerificationForRegisteredUser,
  registerUser,
  resetPasswordForUser,
  verifyOtpForForgotPasswordForUser,
  verifyToken,
} from "../controllers/user.controller.js";
import { razorpayController } from "../controllers/razorpay.controller.js";

const router = express.Router();

// Route for user register
router.post("/register-user", registerUser);

// Route for user otp verification
router.post("/verify-otp-user", otpVerificationForRegisteredUser);

// Route for user login
router.post("/login-user", loginUser);

// Route for initiating forgot password
router.post("/forgot-password-user", initiateForgotPasswordForUser);

// Route for verifying forgot password OTP
router.post("/verify-reset-otp-user", verifyOtpForForgotPasswordForUser);

// Route for resetting password
router.post("/reset-password-user", resetPasswordForUser);

// Route for fetching user data with authentication
router.get("/user-data", verifyToken, getUserData);

// Route for user logout
router.post("/logout-user", logoutUser);

router.post("/save-order",orderProduct);

// payment gateway routes 
router.post('/razorpay', razorpayController);

 

export default router;
