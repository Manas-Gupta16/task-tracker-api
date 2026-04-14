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

  description: { // ✅ ADDED
    type: String,
    default: ""
  },

  completed: {
    type: Boolean,
    default: false
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
  }

},
{
  timestamps: true
}
)

module.exports = mongoose.model("Task", taskSchema)