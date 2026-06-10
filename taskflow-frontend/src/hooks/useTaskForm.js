import { useState, useCallback } from "react"

function useTaskForm(
    addTask,
    setActiveTag
) {

    const [title, setTitle] =
        useState("")

    const [description, setDescription] =
        useState("")

    const [tags, setTags] =
        useState("")

    const [priority, setPriority] =
        useState("medium")

    const [category, setCategory] =
        useState("personal")

    const [startTime, setStartTime] =
        useState(null)

    const [endTime, setEndTime] =
        useState(null)

    const resetForm = useCallback(() => {

        setTitle("")
        setDescription("")
        setTags("")
        setPriority("medium")
        setCategory("personal")
        setStartTime(null)
        setEndTime(null)

    }, [])

    const handleAddTask = useCallback(() => {

        addTask(
            {
                title,
                description,

                tags: [...new Set(
                    tags
                        .split(",")
                        .map(t =>
                            t.trim().toLowerCase()
                        )
                        .filter(Boolean)
                )],

                priority,
                category,

                startTime:
                    startTime?.toISOString(),

                endTime:
                    endTime?.toISOString()
            },

            resetForm,
            setActiveTag
        )

    }, [
        addTask,
        title,
        description,
        tags,
        priority,
        category,
        startTime,
        endTime,
        resetForm,
        setActiveTag
    ])

    return {

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

        handleAddTask
    }

}

export default useTaskForm