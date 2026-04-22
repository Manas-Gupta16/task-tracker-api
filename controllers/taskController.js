const Task = require("../models/Task")

// ✅ CREATE TASK
exports.createTask = async (req, res) => {
  try {

    const { title, description, tags, priority, startTime, endTime } = req.body

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      tags: tags || [], // ✅ NEW (safe fallback)
      priority,
      startTime,
      endTime
    })

    res.status(201).json(task)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


// ✅ GET TASKS
exports.getTasks = async (req, res) => {
  try {

    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.json(tasks)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


// ✅ UPDATE TASK
exports.updateTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags ?? task.tags // ✅ keep old tags if not sent
      },
      { new: true }
    )

    res.json(updatedTask)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


// ✅ DELETE TASK
exports.deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await task.deleteOne()

    res.json({ message: "Task removed" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}