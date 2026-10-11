const User = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");

const createActivationToken = (userId) => {
  return jwt.sign(
    { id: userId, purpose: "user-activation" },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      isActive: false,
    });

    const activationToken = createActivationToken(user._id);

    const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `
        <h1>Hello ${user.name}</h1>
        <p>Please click on the link below to activate your account:</p>
        <a href="${activationUrl}">${activationUrl}</a>
      `,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const activateUser = async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return next(new ErrorHandler("Activation token is required", 400));
    }

    const decoded = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (decoded.purpose !== "user-activation" || !decoded.id) {
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.isActive) {
      return next(new ErrorHandler("Account is already activated", 400));
    }

    user.isActive = true;
    await user.save();

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler("Please provide email and password", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (!user.isActive) {
      return next(new ErrorHandler("Please activate your account first", 403));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { name, phoneNumber, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = {
  registerUser,
  activateUser,
  loginUser,
  updateUserInfo,
};