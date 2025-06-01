import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
	TextField,
	Button,
	Container,
	Typography,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Snackbar,
	Alert,
} from '@mui/material'
import {
	createMeeting,
	updateMeeting,
	getMeetingById,
} from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Meeting } from '../../types'

const MeetingForm: React.FC = () => {
	const { user } = useAuth()
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const isEditing = !!id
	const [snackbar, setSnackbar] = useState<{
		open: boolean
		message: string
		severity: 'error' | 'success'
	}>({ open: false, message: '', severity: 'error' })

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			date: '',
			startTime: '',
			endTime: '',
			participants: [] as string[],
			createdBy: user?.uid || '',
			createdAt: new Date().toISOString(), // Added createdAt
			status: 'scheduled' as 'scheduled' | 'canceled',
		},
		validationSchema: Yup.object({
			title: Yup.string().required('Required'),
			date: Yup.string().required('Required'),
			startTime: Yup.string().required('Required'),
			endTime: Yup.string().required('Required'),
			participants: Yup.array().of(Yup.string().email('Invalid email')),
		}),
		onSubmit: async values => {
			try {
				if (isEditing) {
					await updateMeeting(id!, values)
					setSnackbar({
						open: true,
						message: 'Meeting updated successfully',
						severity: 'success',
					})
				} else {
					await createMeeting(values)
					setSnackbar({
						open: true,
						message: 'Meeting created successfully',
						severity: 'success',
					})
				}
				navigate('/meetings')
			} catch (error: any) {
				setSnackbar({
					open: true,
					message: `Failed to ${isEditing ? 'update' : 'create'} meeting: ${
						error.message || 'Unknown error'
					}`,
					severity: 'error',
				})
			}
		},
	})

	useEffect(() => {
		if (isEditing) {
			const fetchMeeting = async () => {
				try {
					const meeting: Meeting = await getMeetingById(id!)
					formik.setValues({
						title: meeting.title,
						description: meeting.description,
						date: meeting.date,
						startTime: meeting.startTime,
						endTime: meeting.endTime,
						participants: meeting.participants,
						createdBy: meeting.createdBy, // Fixed: Use meeting.createdBy, not meeting.createdAt
						createdAt: meeting.createdBy, // Added createdAt
						status: meeting.status,
					})
				} catch (error: any) {
					setSnackbar({
						open: true,
						message:
							'Failed to load meeting: ' + (error.message || 'Unknown error'),
						severity: 'error',
					})
				}
			}
			fetchMeeting()
		}
	}, [id, isEditing])

	return (
		<Container maxWidth='sm'>
			<Typography variant='h4'>
				{isEditing ? 'Edit Meeting' : 'Create Meeting'}
			</Typography>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					label='Title'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('title')}
					error={formik.touched.title && !!formik.errors.title}
					helperText={formik.touched.title && formik.errors.title}
				/>
				<TextField
					label='Description'
					fullWidth
					margin='normal'
					multiline
					rows={4}
					{...formik.getFieldProps('description')}
				/>
				<TextField
					type='date'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('date')}
					error={formik.touched.date && !!formik.errors.date}
					helperText={formik.touched.date && formik.errors.date}
				/>
				<TextField
					type='time'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('startTime')}
					error={formik.touched.startTime && !!formik.errors.startTime}
					helperText={formik.touched.startTime && formik.errors.startTime}
				/>
				<TextField
					type='time'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('endTime')}
					error={formik.touched.endTime && !!formik.errors.endTime}
					helperText={formik.touched.endTime && formik.errors.endTime}
				/>
				<TextField
					label='Participants (comma-separated emails)'
					fullWidth
					margin='normal'
					onChange={e =>
						formik.setFieldValue(
							'participants',
							e.target.value.split(',').map(email => email.trim())
						)
					}
					value={formik.values.participants.join(',')}
					error={formik.touched.participants && !!formik.errors.participants}
					helperText={formik.touched.participants && formik.errors.participants}
				/>
				<FormControl fullWidth margin='normal'>
					<InputLabel>Status</InputLabel>
					<Select {...formik.getFieldProps('status')}>
						<MenuItem value='scheduled'>Scheduled</MenuItem>
						<MenuItem value='canceled'>Canceled</MenuItem>
					</Select>
				</FormControl>
				<Button
					type='submit'
					variant='contained'
					color='primary'
					fullWidth
					sx={{ mt: 2 }}
				>
					{isEditing ? 'Update' : 'Create'}
				</Button>
			</form>
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

export default MeetingForm
