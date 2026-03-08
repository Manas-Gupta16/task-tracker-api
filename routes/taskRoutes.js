const express = require('express')
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// Create Task
router.post('/', protect, createTask)

// Get All Tasks
router.get('/', protect, getTasks)

// Update Task
router.put('/:id', protect, updateTask)

// Delete Task
router.delete('/:id', protect, deleteTask)

module.exports = router