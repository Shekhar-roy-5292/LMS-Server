import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
const userModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name must be provided"],
      minLength: [5, "Name must be at least 5 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password must be at least 6 character"],
      select: false, // hide password in response
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  {
    timestamps: true, // add created_at and updated_at fields automatically
  }
);
userModel.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userModel.methods = {
  generateJWTToken: async function () {
    return await JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
        subscription: this.subscription,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  },
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
};
const User = mongoose.model("User", userModel);
export default User;
