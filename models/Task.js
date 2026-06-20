const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  tags: {
    type: [String],
    default: []
  },

  category: {
    type: String,
    enum: ["work", "study", "personal"],
    default: "personal"
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  startTime: {
    type: Date,
    default: null
  },

  endTime: {
    type: Date,
    default: null
  },

  timeSpent: {
    type: Number,
    default: 0
  },

  isRecurring: {
    type: Boolean,
    default: false
  },

  recurrencePattern: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none"
  }

},
{
  timestamps: true
}
)

module.exports = mongoose.model("Task", taskSchema)