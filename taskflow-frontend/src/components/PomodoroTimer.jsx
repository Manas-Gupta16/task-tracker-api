import { useState, useEffect } from "react"
import { Play, Pause, Square, X } from "lucide-react"
import { useGlobalTasks } from "../context/TaskContext"

export default function PomodoroTimer() {
    const { activeTimerTask, setActiveTimerTask, updateTaskTime } = useGlobalTasks()
    
    // Timer state
    const WORK_MINUTES = 25
    const BREAK_MINUTES = 5
    
    const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState("work") // "work" | "break"
    
    // Keep track of total elapsed time in work mode for the active task
    const [elapsedWorkTime, setElapsedWorkTime] = useState(0)

    useEffect(() => {
        let interval = null
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1)
                if (mode === "work") {
                    setElapsedWorkTime(prev => prev + 1)
                }
            }, 1000)
        } else if (isRunning && timeLeft === 0) {
            // Timer finished
            handleTimerComplete()
        }
        return () => clearInterval(interval)
    }, [isRunning, timeLeft, mode])

    const handleTimerComplete = () => {
        // Play sound (optional)
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg")
        audio.play().catch(() => {})
        
        setIsRunning(false)
        
        // Save accumulated work time to backend if finishing a work session
        if (mode === "work" && activeTimerTask) {
            saveTimeToBackend()
        }
        
        // Switch mode
        if (mode === "work") {
            setMode("break")
            setTimeLeft(BREAK_MINUTES * 60)
        } else {
            setMode("work")
            setTimeLeft(WORK_MINUTES * 60)
        }
    }

    const saveTimeToBackend = () => {
        if (elapsedWorkTime > 0 && activeTimerTask) {
            const minutesToAdd = Math.ceil(elapsedWorkTime / 60)
            const currentSpent = activeTimerTask.timeSpent || 0
            updateTaskTime(activeTimerTask._id, currentSpent + minutesToAdd)
            setElapsedWorkTime(0)
        }
    }

    const toggleTimer = () => setIsRunning(!isRunning)
    
    const stopTimer = () => {
        setIsRunning(false)
        saveTimeToBackend()
        setMode("work")
        setTimeLeft(WORK_MINUTES * 60)
    }

    const closeTimer = () => {
        stopTimer()
        setActiveTimerTask(null)
    }

    if (!activeTimerTask) return null

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    return (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 w-72 z-50">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white truncate w-48" title={activeTimerTask.title}>
                        {activeTimerTask.title}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mode === "work" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}>
                        {mode === "work" ? "Focus" : "Break"}
                    </span>
                </div>
                <button onClick={closeTimer} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={16} />
                </button>
            </div>
            
            <div className="text-4xl font-black text-center mb-4 text-gray-800 dark:text-white font-mono">
                {formatTime(timeLeft)}
            </div>
            
            <div className="flex justify-center gap-3">
                <button onClick={toggleTimer} className={`p-3 rounded-full text-white ${isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
                <button onClick={stopTimer} className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    <Square size={20} />
                </button>
            </div>
        </div>
    )
}
