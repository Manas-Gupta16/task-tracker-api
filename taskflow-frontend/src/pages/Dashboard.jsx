function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-6">
        TaskFlow Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <input
          type="text"
          placeholder="Add new task..."
          className="border p-3 w-full rounded-lg mb-4"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add Task
        </button>

      </div>

    </div>
  )
}

export default Dashboard