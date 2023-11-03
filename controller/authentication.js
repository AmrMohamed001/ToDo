const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const appError = require("../utils/appError");
////////////////////////////////////////////////
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRETJWT, {
    expiresIn: process.env.EXPIRSTIONJWT,
  });
};
////////////////////////////////////////////////
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    data: {
      token,
      newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  // 1)
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("email or password not found", 400));

  // 2)
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new appError("Password is not correct", 402));

  // 3)
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    data: {
      token,
    },
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) get the token and check it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new appError("token is not found", 401));
  console.log(`token : ${token}`);
  // 2) verify the token
  const decode = await util.promisify(jwt.verify)(token, process.env.SECRETJWT);
  console.log(decode);
  //3)check if the user still exist
  const currentUser = await User.findById(decode.id);
  if (!currentUser) return next(new appError("user is not found", 401));
  //4) check if the user changed the password after signing the token
  if (currentUser.userChangePassword(decode.iat))
    return next(new appError("user changed password,try again !", 401));
  res.user = currentUser;
  next();
});
exports.forgetPassword = catchAsync(async (req, res, next) => {});
exports.resetPassword = catchAsync(async (req, res, next) => {});
