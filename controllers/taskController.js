const Task = require('../models/Task')

// Create Task
exports.createTask = async (req, res) => {

    const task = await Task.create({
        user: req.user._id,
        title: req.body.title
    })

    res.status(201).json(task)
}

// Get Tasks
exports.getTasks = async (req, res) => {

    const tasks = await Task.find({ user: req.user._id })

    res.json(tasks)
}

// Update Task
exports.updateTask = async (req, res) => {

    const task = await Task.findById(req.params.id)

    if(!task){
        return res.status(404).json({message:"Task not found"})
    }

    task.title = req.body.title || task.title
    task.completed = req.body.completed ?? task.completed

    const updatedTask = await task.save()

    res.json(updatedTask)
}

// Delete Task
exports.deleteTask = async (req, res) => {

    const task = await Task.findById(req.params.id)

    if(!task){
        return res.status(404).json({message:"Task not found"})
    }

    await task.deleteOne()

    res.json({message:"Task deleted"})
}