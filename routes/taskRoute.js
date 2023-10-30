const express = require('express')
const router = express.Router()
const taskController = require('./../controller/taskController')
//////////////////////////////////////////////////////////
router.get('/states', taskController.getStates)
router.route('/').get(taskController.getAllTasks).post(taskController.addTask)
router.route('/:id').get(taskController.getTask).patch(taskController.updateTask).delete(taskController.deleteTask)
//////////////////////////////////////////////////////////////
module.exports = router