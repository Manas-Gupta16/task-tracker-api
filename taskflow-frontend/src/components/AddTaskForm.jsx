import DatePicker from "react-datepicker"

function AddTaskForm({
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    priority,
    setPriority,
    category,
    setCategory,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    addTask,
    markAllCompleted,
    bulkLoading,
    allCompleted
}) {

    return (

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">

            {/* INPUT ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">

                <input
                    type="text"
                    placeholder="Enter task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white w-full"
                />

                <input
                    type="text"
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white w-full"
                />

                <div className="flex flex-col w-full">

                    <input
                        type="text"
                        placeholder="e.g. study, dsa, exam"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                e.preventDefault()
                                addTask()
                            }

                        }}
                        className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white w-full"
                    />

                    <p className="text-xs text-gray-400 mt-1 italic">
                        Separate tags using commas
                    </p>

                </div>

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white w-full"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

            </div>

            {/* CATEGORY */}
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="personal">Personal</option>
            </select>

            {/* DATE ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                <DatePicker
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    showTimeSelect
                    placeholderText="Start Time"
                    className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                />

                <DatePicker
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    placeholderText="End Time"
                    className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                />

            </div>

            {/* BUTTON ROW */}
            <div className="flex justify-end gap-4 mt-2">

                <button
                    onClick={addTask}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                >
                    Add Task
                </button>

                <button
                    onClick={markAllCompleted}
                    disabled={bulkLoading || allCompleted}
                    className={`px-6 py-3 rounded-lg text-white transition font-medium shadow-md
                        ${bulkLoading || allCompleted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"}
                    `}
                >
                    {bulkLoading ? "Completing..." : "Complete All"}
                </button>

            </div>

        </div>

    )

}

export default AddTaskForm