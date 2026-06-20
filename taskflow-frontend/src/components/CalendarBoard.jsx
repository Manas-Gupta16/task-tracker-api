import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarBoard({ tasks, startEdit }) {
    const events = tasks.filter(t => t.startTime || t.endTime).map(t => {
        const start = t.startTime ? new Date(t.startTime) : new Date(t.endTime)
        let end = t.endTime ? new Date(t.endTime) : new Date(start.getTime() + 60 * 60 * 1000) // Default 1 hr duration
        
        // if start and end are the exact same time, add 1 hour so it shows up in week/day view
        if (start.getTime() === end.getTime()) {
            end = new Date(start.getTime() + 60 * 60 * 1000)
        }

        return {
            id: t._id,
            title: t.title,
            start: start,
            end: end,
            resource: t
        }
    })

    const eventStyleGetter = (event, start, end, isSelected) => {
        const task = event.resource
        let backgroundColor = '#3b82f6' // default blue
        if (task.status === "completed") {
            backgroundColor = '#10b981' // green
        } else if (task.priority === "high") {
            backgroundColor = '#ef4444' // red
        } else if (task.priority === "medium") {
            backgroundColor = '#f59e0b' // yellow/orange
        }
        
        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                display: 'block',
                padding: '2px 5px',
                fontSize: '12px',
                fontWeight: '500'
            }
        }
    }

    return (
        <div className="h-[700px] w-full bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
            <style>
                {`
                .rbc-calendar {
                    font-family: inherit;
                }
                .rbc-header {
                    padding: 10px;
                    font-weight: 600;
                    color: #4b5563;
                }
                .dark .rbc-header {
                    color: #e5e7eb;
                    border-bottom: 1px solid #374151;
                }
                .rbc-month-view, .rbc-time-view {
                    border-color: #e5e7eb;
                }
                .dark .rbc-month-view, .dark .rbc-time-view {
                    border-color: #374151;
                }
                .rbc-day-bg, .rbc-month-row {
                    border-color: #e5e7eb;
                }
                .dark .rbc-day-bg, .dark .rbc-month-row {
                    border-color: #374151;
                }
                .rbc-off-range-bg {
                    background: #f9fafb;
                }
                .dark .rbc-off-range-bg {
                    background: #1f2937;
                }
                .rbc-today {
                    background: #eff6ff;
                }
                .dark .rbc-today {
                    background: #1e3a8a30;
                }
                .rbc-date-cell {
                    padding: 5px;
                }
                `}
            </style>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => startEdit(event.resource)}
                eventPropGetter={eventStyleGetter}
                className="dark:text-white"
            />
        </div>
    )
}
