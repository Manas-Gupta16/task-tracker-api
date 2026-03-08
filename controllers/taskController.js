const Task = require('../models/Task')

// Create Task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            user: req.user._id,
            title: req.body.title
        })

        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id })

        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        task.title = req.body.title || task.title
        task.completed = req.body.completed ?? task.completed

        const updatedTask = await task.save()

        res.json(updatedTask)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        await task.deleteOne()

        res.json({ message: "Task deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}