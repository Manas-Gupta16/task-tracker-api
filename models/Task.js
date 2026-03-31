const mongoose = require('mongoose')

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

    completed: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },

    deadline: {
        type: Date
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Task", taskSchema)