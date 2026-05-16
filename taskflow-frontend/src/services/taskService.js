import API from "./api"

const getAuthHeader = () => {

    const token = localStorage.getItem("token")

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

}

export const fetchTasksService = async () => {

    const res = await API.get(
        "/tasks",
        getAuthHeader()
    )

    return res.data

}

export const fetchStatsService = async () => {

    const res = await API.get(
        "/tasks/stats",
        getAuthHeader()
    )

    return res.data

}

export const addTaskService = async (taskData) => {

    const res = await API.post(
        "/tasks",
        taskData,
        getAuthHeader()
    )

    return res.data

}

export const deleteTaskService = async (taskId) => {

    await API.delete(
        `/tasks/${taskId}`,
        getAuthHeader()
    )

}

export const updateTaskService = async (taskId, updatedData) => {

    const res = await API.put(
        `/tasks/${taskId}`,
        updatedData,
        getAuthHeader()
    )

    return res.data

}