import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }]  
});
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{6,}$/.test(
            v
          );
        },
        message: (props) =>
          `${props.value} is not a valid password! It must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one special character, and one number.`,
      },
    },
    is_registered_user_verified: {
      type: Boolean,
      default: false,
    },
    userRegisterOTP: {
      code: String,
      expiration: Date,
    },
    is_reset_password_user_verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOTP: {
      code: String,
      expiration: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Product = mongoose.model("Product", productSchema);

 