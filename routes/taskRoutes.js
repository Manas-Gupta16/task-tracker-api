const express = require('express')
console.log("Task routes loaded")
const Task = require('../models/Task')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// Create Task
router.post('/', protect, async (req, res) => {
  const { title } = req.body

  const task = await Task.create({
    user: req.user._id,
    title
  })

  res.status(201).json(task)
})

// Get All Tasks (only for logged-in user)
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id })
  res.json(tasks)
})

// Update Task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  task.title = req.body.title || task.title
  task.completed = req.body.completed ?? task.completed

  const updatedTask = await task.save()

  res.json(updatedTask)
})

// Delete Task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  await task.deleteOne()

  res.json({ message: 'Task deleted' })
})

module.exports = router