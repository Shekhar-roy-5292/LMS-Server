import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 60,
  httpOnly: true,
  secure: true,
};
const  register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError(400, "All fields must be provided"));
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError(400, "Email already exists"));
  }
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg",
    },
  });
  if (!user) {
    return next(
      new AppError(400, "User Registration Failed, please try again")
    );
  }
  //TODO: File upload
  await user.save();
  user.password = undefined;
  const token = await user.generateJWTToken();
  res.cookie("jwt", token, cookieOptions);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(400, "All fields are required"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.comparePassword(password)) {
      return next(new AppError(401, "Invalid email or password"));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(500, e.message));
  }
};
const logout = (req, res) => {
  res.cookie("jwt", null, {
    secure: true,
    httpOnly: true,
    maxAge: 0,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
    // if (!user) {
    //   return next(new AppError(404, "User not found"));
    // }
  } catch (error) {
    return next(new AppError(500, "Failed to fetch user detail"));
  }
};

export { register, login, logout, getProfile };
