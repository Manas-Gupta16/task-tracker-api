import DatePicker from "react-datepicker"

function TaskEditForm({
    editingTask,
    setEditingTask,
    saveEdit
}) {

    return (

        <div className="flex flex-wrap gap-3 w-full items-center">

            <input
                value={editingTask.title}
                onChange={(e) =>
                    setEditingTask({
                        ...editingTask,
                        title: e.target.value
                    })
                }
                className="border p-2 rounded"
            />

            <input
                value={editingTask.description}
                onChange={(e) =>
                    setEditingTask({
                        ...editingTask,
                        description: e.target.value
                    })
                }
                className="border p-2 rounded"
                placeholder="Description"
            />

            <input
                value={editingTask.tags}
                onChange={(e) =>
                    setEditingTask({
                        ...editingTask,
                        tags: e.target.value
                    })
                }
                className="border p-2 rounded"
                placeholder="Tags (comma separated)"
            />

            <select
                value={editingTask.category}
                onChange={(e) =>
                    setEditingTask({
                        ...editingTask,
                        category: e.target.value
                    })
                }
                className="border p-2 rounded"
            >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="personal">Personal</option>
            </select>

            <DatePicker
                selected={editingTask.startTime}
                onChange={(date) =>
                    setEditingTask({
                        ...editingTask,
                        startTime: date
                    })
                }
                showTimeSelect
                className="border p-2 rounded"
            />

            <DatePicker
                selected={editingTask.endTime}
                onChange={(date) =>
                    setEditingTask({
                        ...editingTask,
                        endTime: date
                    })
                }
                showTimeSelect
                className="border p-2 rounded"
            />

            <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-3 rounded"
            >
                Save
            </button>

            <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 text-white px-3 rounded"
            >
                Cancel
            </button>

        </div>

    )

}

export default TaskEditForm