const express = require('express')
const { createTask, getTasks, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// ✅ Create Task
router.post('/', protect, createTask)

// ✅ Get All Tasks
router.get('/', protect, getTasks)

// ✅ Get Task Stats (NEW)
router.get('/stats', protect, getTaskStats)

// ✅ Update Task
router.put('/:id', protect, updateTask)

// ✅ Delete Task
router.delete('/:id', protect, deleteTask)

module.exports = router