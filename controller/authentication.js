const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')
////////////////////////////////////////////////
const signToken = (id) => {
    return jwt.sign({id}, process.env.SECRETJWT, {
        expiresIn: process.env.EXPIRSTIONJWT
    })
}
////////////////////////////////////////////////
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id)
    res.status(201).json({
        status: "success",
        data: {
            token,
            newUser
        }
    })

})
exports.login = catchAsync(async (req, res, next) => {
// 1)
    const {email, password} = req.body
    if (!email || !password) return next(new appError('email or password not found', 400))

// 2)
    const user = await User.findOne({email}).select('+password')
    if (!user || !await user.checkPassword(password, user.password)) return next(new appError('Password is not correct', 402))

// 3)
    const token = signToken(user._id)
    res.status(201).json({
        status: "success",
        data: {
            token
        }
    })
})
exports.protect = catchAsync(async (req, res, next) => {
})
exports.forgetPassword = catchAsync(async (req, res, next) => {
})
exports.resetPassword = catchAsync(async (req, res, next) => {
})