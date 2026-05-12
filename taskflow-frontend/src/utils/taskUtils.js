const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-indigo-500"
]

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}

export const getTaskStatus = (task, now) => {

    if (!task.startTime || !task.endTime) return null

    const start = new Date(task.startTime).getTime()
    const end = new Date(task.endTime).getTime()

    const diff = end - now

    if (diff < 0) {
        return { label: "Overdue", color: "text-red-500" }
    }

    if (now >= start && now <= end) {
        return { label: "Happening Now", color: "text-blue-500" }
    }

    if (diff <= 60 * 60 * 1000) {
        return { label: "Due Soon", color: "text-yellow-500" }
    }

    return { label: "Upcoming", color: "text-green-500" }
}

export const getTimeRemaining = (endTime, now) => {

    const end = new Date(endTime).getTime()
    const diff = end - now

    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m left`
    }

    return `${minutes}m left`
}

export const getPriorityStyle = (priority) => {

    if (priority === "high")
        return "bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold"

    if (priority === "medium")
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold"

    return "bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold"
}

export const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export const getTagColor = (tag) => {

    let hash = 0

    for (let i = 0; i < tag.length; i++) {
        hash += tag.charCodeAt(i)
    }

    return colors[hash % colors.length]
}