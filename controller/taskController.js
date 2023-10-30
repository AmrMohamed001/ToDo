const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError')
const features = require('./../utils/apiFeatures')
const Task = require('../models/taskModel')
//////////////////////////////////////////////////////
exports.getAllTasks = catchAsync(async (req, res, next) => {
    const data = await Task.find()
    let size = data.length
    const query = Task.find()
    let apif = new features(query, req.query).filter().sorting().pagination().projection()
    if (req.query.page) {
        if (apif.skip >= size)
            next(new appError('page not found', 404))
    }
    const tasks = await apif.query
    res.status(200).json({
        status: "success",
        data: {
            firstpage: 1,
            lastPage: size / 5,
            currentPage: req.query.page * 1 || 1,
            results: tasks.length,
            totalSize: size,
            tasks
        }
    })
})

exports.getTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id})
    res.status(200).json({
        status: "success",
        data: {
            task
        }
    })

})

exports.addTask = catchAsync(async (req, res, next) => {
    const task = await Task.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            task
        }
    })

})

exports.updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: "success",
        data: {
            task
        }
    })

})

exports.deleteTask = catchAsync(async (req, res, next) => {
    await Task.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.getStates = catchAsync(async (req, res, next) => {
    const states = await Task.aggregate([
        {
            $group: {
                _id: {$dayOfMonth: '$createdAt'},
                Total: {$sum: 1},
                names: {$push: '$_id'}

            }
        },
        {
            $addFields: {day: '$_id'}
        },
        {
            $sort: {day: 1}
        },
        {
            $project: {_id: 0}
        }
    ])
    res.status(200).json({
        status: "success",
        data: {
            states
        }
    })

})