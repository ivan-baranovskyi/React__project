import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getMeetings } from '../../services/api'
import { Meeting } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CalendarView: React.FC = () => {
	const { user, isAdmin } = useAuth()
	const [events, setEvents] = useState<any[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchMeetings = async () => {
			if (user) {
				const meetings = await getMeetings(user.uid, isAdmin)
				const calendarEvents = meetings.map((meeting: Meeting) => ({
					title: meeting.title,
					start: `${meeting.date}T${meeting.startTime}`,
					end: `${meeting.date}T${meeting.endTime}`,
					id: meeting.id,
				}))
				setEvents(calendarEvents)
			}
		}
		fetchMeetings()
	}, [user, isAdmin])

	const handleEventClick = (info: any) => {
		navigate(`/meetings/edit/${info.event.id}`)
	}

	return (
		<FullCalendar
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView='dayGridMonth'
			events={events}
			eventClick={handleEventClick}
			headerToolbar={{
				left: 'prev,next today',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay',
			}}
		/>
	)
}

export default CalendarView
