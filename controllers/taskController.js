const Task = require("../models/Task")

// ✅ CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, tags, priority, startTime, endTime, category, timeSpent, isRecurring, recurrencePattern } = req.body

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      tags,
      priority,
      startTime,
      endTime,
      category,
      timeSpent,
      isRecurring,
      recurrencePattern
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
    const mappedTasks = tasks.map(task => {
      const obj = task.toObject();
      if (!obj.status) {
        obj.status = obj.completed ? "completed" : "pending";
      }
      return obj;
    });

    res.json(mappedTasks);

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

    const wasCompleted = task.status === "completed"

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags ?? task.tags // keep old tags if not sent
      },
      { new: true }
    )

    const isNowCompleted = updatedTask.status === "completed"

    if (!wasCompleted && isNowCompleted && updatedTask.isRecurring && updatedTask.recurrencePattern !== "none") {
       let nextStartTime = updatedTask.startTime ? new Date(updatedTask.startTime) : new Date();
       let nextEndTime = updatedTask.endTime ? new Date(updatedTask.endTime) : null;
       
       if (updatedTask.recurrencePattern === "daily") {
          nextStartTime.setDate(nextStartTime.getDate() + 1);
          if (nextEndTime) nextEndTime.setDate(nextEndTime.getDate() + 1);
       } else if (updatedTask.recurrencePattern === "weekly") {
          nextStartTime.setDate(nextStartTime.getDate() + 7);
          if (nextEndTime) nextEndTime.setDate(nextEndTime.getDate() + 7);
       } else if (updatedTask.recurrencePattern === "monthly") {
          nextStartTime.setMonth(nextStartTime.getMonth() + 1);
          if (nextEndTime) nextEndTime.setMonth(nextEndTime.getMonth() + 1);
       }
       
       await Task.create({
          user: updatedTask.user,
          title: updatedTask.title,
          description: updatedTask.description,
          tags: updatedTask.tags,
          priority: updatedTask.priority,
          category: updatedTask.category,
          startTime: nextStartTime,
          endTime: nextEndTime,
          isRecurring: true,
          recurrencePattern: updatedTask.recurrencePattern,
          status: "pending",
          timeSpent: 0
       });
    }

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


// ✅ GET TASK STATS (Optimized)
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id

    const total = await Task.countDocuments({ user: userId })

    const completed = await Task.countDocuments({
      user: userId,
      $or: [{ status: "completed" }, { completed: true }]
    })

    const pending = total - completed

    const highPriority = await Task.countDocuments({
      user: userId,
      priority: "high"
    })

    const overdue = await Task.countDocuments({
      user: userId,
      endTime: { $lt: new Date() },
      $and: [
        { status: { $ne: "completed" } },
        { completed: { $ne: true } }
      ]
    })

    res.json({
      total,
      completed,
      pending,
      highPriority,
      overdue
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
} 