import React, { useEffect, useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Container,
	TextField,
	Box,
	Typography,
	Snackbar,
	Alert,
} from '@mui/material'
import { getMeetings, deleteMeeting } from '../../services/api'
import { Meeting } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MeetingList: React.FC = () => {
	const { user, isAdmin } = useAuth()
	const [meetings, setMeetings] = useState<Meeting[]>([])
	const [filterDate, setFilterDate] = useState('')
	const [filterParticipant, setFilterParticipant] = useState('')
	const [sortBy, setSortBy] = useState<'startTime' | 'createdAt'>('startTime')
	const [snackbar, setSnackbar] = useState<{
		open: boolean
		message: string
		severity: 'error' | 'success'
	}>({ open: false, message: '', severity: 'error' })
	const navigate = useNavigate()

	useEffect(() => {
		const fetchMeetings = async () => {
			try {
				if (user) {
					const data = await getMeetings(user.uid, isAdmin)
					setMeetings(data)
				}
			} catch (error: any) {
				setSnackbar({
					open: true,
					message:
						'Failed to load meetings: ' + (error.message || 'Unknown error'),
					severity: 'error',
				})
			}
		}
		fetchMeetings()
	}, [user, isAdmin])

	const handleDelete = async (id: string) => {
		if (window.confirm('Are you sure you want to delete this meeting?')) {
			try {
				await deleteMeeting(id)
				setMeetings(meetings.filter(meeting => meeting.id !== id))
				setSnackbar({
					open: true,
					message: 'Meeting deleted successfully',
					severity: 'success',
				})
			} catch (error: any) {
				setSnackbar({
					open: true,
					message:
						'Failed to delete meeting: ' + (error.message || 'Unknown error'),
					severity: 'error',
				})
			}
		}
	}

	// Filtering and sorting
	const filteredMeetings = meetings
		.filter(meeting => (filterDate ? meeting.date === filterDate : true))
		.filter(meeting =>
			filterParticipant
				? meeting.participants.includes(filterParticipant)
				: true
		)
		.sort((a, b) => {
			if (sortBy === 'startTime') {
				return `${a.date}T${a.startTime}`.localeCompare(
					`${b.date}T${b.startTime}`
				)
			}
			return a.createdBy.localeCompare(b.createdBy)
		})

	return (
		<Container>
			<Typography variant='h4' sx={{ mb: 2 }}>
				Meetings
			</Typography>
			<Box sx={{ display: 'flex', gap: 2, my: 2 }}>
				<TextField
					type='date'
					label='Filter by Date'
					value={filterDate}
					onChange={e => setFilterDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					label='Filter by Participant Email'
					value={filterParticipant}
					onChange={e => setFilterParticipant(e.target.value)}
				/>
				<Button
					variant='outlined'
					onClick={() =>
						setSortBy(sortBy === 'startTime' ? 'createdAt' : 'startTime')
					}
				>
					Sort by {sortBy === 'startTime' ? 'Created At' : 'Start Time'}
				</Button>
			</Box>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Start Time</TableCell>
						<TableCell>End Time</TableCell>
						<TableCell>Participants</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredMeetings.map(meeting => (
						<TableRow key={meeting.id}>
							<TableCell>{meeting.title}</TableCell>
							<TableCell>{meeting.date}</TableCell>
							<TableCell>{meeting.startTime}</TableCell>
							<TableCell>{meeting.endTime}</TableCell>
							<TableCell>{meeting.participants.join(', ')}</TableCell>
							<TableCell>{meeting.status}</TableCell>
							<TableCell>
								{(isAdmin || meeting.createdBy === user?.uid) && (
									<>
										<Button
											onClick={() => navigate(`/meetings/edit/${meeting.id}`)}
											variant='contained'
											color='primary'
											size='small'
											sx={{ mr: 1 }}
										>
											Edit
										</Button>
										<Button
											onClick={() => handleDelete(meeting.id)}
											variant='contained'
											color='error'
											size='small'
										>
											Delete
										</Button>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Button
				variant='contained'
				color='primary'
				onClick={() => navigate('/meetings/new')}
				sx={{ mt: 2 }}
			>
				Create New Meeting
			</Button>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert severity={snackbar.severity}>{snackbar.message}</Alert>
			</Snackbar>
		</Container>
	)
}

export default MeetingList
