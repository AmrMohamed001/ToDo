const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError')
const User = require('../models/userModel')
//////////////////////////////////////////////////////////////////
exports.getUsers = catchAsync(async (req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        status:"success",
        data:{
            users
        }
    })
})
exports.getUser = catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.params.id)
    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})
exports.addUser = catchAsync(async (req,res,next)=>{
    const user = await User.create(req.body)
    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})
exports.updateUser = catchAsync(async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id , req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})
exports.deleteUser = catchAsync(async (req,res,next)=>{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status:"success",
        data:null
    })
})