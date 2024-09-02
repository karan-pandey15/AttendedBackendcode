import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Order } from "../models/orderSchema.js";

const JWT_SECRET_KEY = "this_is_maras's_secret_key";

// Generate a random 6-digit otp and convert it to a string
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

// create transporter for sending mail
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "shiwamsingh058@addrupee.com",
    pass: "7052897704@sS",
  },
});

// Controller for user register
export const registerUser = async (req, res) => {
  const { username, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        Error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      phone,
      email,
      password: hashedPassword,
    });

    const verificationOTP = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const mailOptions = {
      from: "shiwamsingh058@addrupee.com",
      to: email,
      subject: "Email Verification",
      html: `
        <p>Dear ${username},</p>
        <p>To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
        <h4>${verificationOTP}</h4> 
        <p>This OTP is valid for a limited time. Do not share it with anyone for security reasons.</p>
        <p>For any assistance, please contact our support team at shiwamsingh058@addrupee.com.</p>
        <p>Best regards,<br>Shivam Singh</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    newUser.userRegisterOTP = {
      code: verificationOTP,
      expiration: otpExpiration,
    };

    await newUser.save();

    return res.status(201).json({
      Status: "Success",
      Message: "Mail has been sent successfully. Please verify your email.",
      Data: newUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (val) => val.message
      );
      return res.status(400).json({
        Error: errorMessages,
      });
    } else {
      console.error("Registration error:", error);
      return res.status(500).json({
        Status: "Failure",
        Error: "Internal server error",
      });
    }
  }
};

// Controller for user otp verification
export const otpVerificationForRegisteredUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    if (user.userRegisterOTP.expiration < new Date()) {
      return res.status(400).json({
        Error: "OTP has expired",
      });
    }

    if (user.userRegisterOTP.code !== otp) {
      return res.status(400).json({
        Error: "Invalid OTP",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          is_registered_user_verified: true,
          userRegisterOTP: null,
        },
      },
      { new: true }
    );

    const token = jwt.sign({ userId: updatedUser._id }, JWT_SECRET_KEY, {
      expiresIn: "8h",
    });

    res.cookie("token", token);

    const congratsMailOptions = {
      from: "shiwamsingh058@addrupee.com",
      to: email,
      subject: "Congratulations on Email Verification",
      html: `
          <p>Dear ${user.username},</p>
          <p>We are delighted to inform you that your email has been successfully verified.</p>
          <p>As a verified user, you now have access to all the features and benefits of our platform.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Thank you for choosing our service. We look forward to serving you!</p>
          <p>Best regards,<br>Shivam Singh</p>
        `,
    };

    transporter.sendMail(congratsMailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Congratulations email sent: " + info.response);
      }
    });

    return res.status(200).json({
      Status: "Success",
      Message: "Email verified successfully",
      Token: token,
      Data: updatedUser,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};

// Controller for user login
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         Error: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         Error: "Invalid credentials",
//       });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
//       expiresIn: "8h",
//     });
//     res.cookie("token", token);

//     return res.status(200).json({
//       Status: "Success",
//       Message: "Login successful",
//       Token: token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       Status: "Failure",
//       Error: "Internal server error",
//     });
//   }
// };

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        Error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "8h",
    });
    res.cookie("token", token);

    return res.status(200).json({
      Status: "Success",
      Message: "Login successful",
      Token: token,
      User: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};


// Controller for initiating forgot password
export const initiateForgotPasswordForUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    const resetPasswordOTP = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const mailOptions = {
      from: "shiwamsingh058@addrupee.com",
      to: email,
      subject: "Forgot Password OTP",
      html: `
        <p>Dear ${user.username},</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
        <h4>${resetPasswordOTP}</h4> 
        <p>This OTP is valid for a limited time. Do not share it with anyone for security reasons.</p>
        <p>If you did not request this, please ignore this email. Your password will not be changed.</p>
        <p>For any assistance, please contact our support team at shiwamsingh058@addrupee.com.</p>
        <p>Best regards,<br>Shivam Singh</p>
      `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          Status: "Failure",
          Error: "Failed to send OTP email",
        });
      } else {
        console.log("Reset password OTP email sent: " + info.response);
        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              resetPasswordOTP: {
                code: resetPasswordOTP,
                expiration: otpExpiration,
              },
            },
          }
        );
        return res.status(200).json({
          Status: "Success",
          Message: "Reset password OTP sent successfully",
        });
      }
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};

// Controller for verifying forgot password OTP
export const verifyOtpForForgotPasswordForUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    if (!user.resetPasswordOTP || user.resetPasswordOTP.code !== otp) {
      return res.status(400).json({
        Error: "Invalid OTP",
      });
    }

    if (user.resetPasswordOTP.expiration < new Date()) {
      return res.status(400).json({
        Error: "OTP has expired",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordOTP: null,
          is_reset_password_user_verified: true,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      Status: "Success",
      Message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};

// Controller for resetting password
export const resetPasswordForUser = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    if (!user.is_reset_password_user_verified) {
      return res.status(400).json({
        Error: "Reset password not permitted. Please verify OTP first.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
          is_reset_password_user_verified: false,
        },
      }
    );

    return res.status(200).json({
      Status: "Success",
      Message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      Error: "Access denied. No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      Error: "Invalid token",
    });
  }
};

// Controller for fetching user data with authentication
export const getUserData = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    return res.status(200).json({
      Status: "Success",
      Data: user,
    });
  } catch (error) {
    console.error("User data retrieval error:", error);
    return res.status(500).json({
      Status: "Failure",
      Error: "Internal server error",
    });
  }
};

// Controller for user logout
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    Status: "Success",
    Message: "Logout successful",
  });
};


export const orderProduct = async (req, res) => {
  const { user, items } = req.body;
  try { 
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = new Order({ user, items, total });
    
    // Save the order
    await order.save();
    
    res.json({ message: 'Order saved successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
};