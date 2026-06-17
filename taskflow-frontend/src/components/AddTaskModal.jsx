import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTaskForm from "../hooks/useTaskForm";
import { useGlobalTasks } from "../context/TaskContext";

function AddTaskModal({ closeModal }) {
  const { addTask } = useGlobalTasks();

  const {
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
    handleAddTask,
  } = useTaskForm(
    async (...args) => {
      await addTask(...args);
      closeModal(); // Close modal after successful add
    },
    () => {} // dummy setActiveTag, we don't need to change tag on add
  );

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Task Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            autoFocus
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
          <textarea
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[100px]"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tags</label>
          <input
            type="text"
            placeholder="e.g. work, design"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTask();
              }
            }}
            className="border border-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Priority & Category</label>
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            placeholderText="Select Date & Time"
            className="border border-gray-300 p-3 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Time</label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            placeholderText="Select Date & Time"
            className="border border-gray-300 p-3 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={closeModal}
          className="px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleAddTask}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
        >
          Save Task
        </button>
      </div>
    </div>
  );
}

export default AddTaskModal;
