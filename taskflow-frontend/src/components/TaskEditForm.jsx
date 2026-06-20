import DatePicker from "react-datepicker"

function TaskEditForm({
    editingTask,
    setEditingTask,
    saveEdit
}) {
    return (
        <div className="flex flex-col gap-3 w-full bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-3 items-center">
                <input
                    value={editingTask.title || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Task Title"
                />
                
                <select
                    value={editingTask.category || "personal"}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                    className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                </select>

                <select
                    value={editingTask.recurrencePattern || "none"}
                    onChange={(e) => setEditingTask({ ...editingTask, recurrencePattern: e.target.value })}
                    className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="w-full">
                <textarea
                    value={editingTask.description || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Add a detailed description..."
                    className="w-full min-h-[120px] p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-y"
                />
            </div>

            <div className="flex flex-wrap gap-3 items-center z-0">
                <input
                    value={editingTask.tags || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, tags: e.target.value })}
                    className="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Tags (comma separated)"
                />

                <DatePicker
                    selected={editingTask.startTime ? new Date(editingTask.startTime) : null}
                    onChange={(date) => setEditingTask({ ...editingTask, startTime: date })}
                    showTimeSelect
                    className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholderText="Start Time"
                />

                <DatePicker
                    selected={editingTask.endTime ? new Date(editingTask.endTime) : null}
                    onChange={(date) => setEditingTask({ ...editingTask, endTime: date })}
                    showTimeSelect
                    className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholderText="End Time"
                />
            </div>

            <div className="flex gap-2 justify-end mt-2">
                <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default TaskEditForm