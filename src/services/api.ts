import axios from 'axios'
import { Meeting } from '../types'

const api = axios.create({
	baseURL: 'http://localhost:3001',
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	const token =
		localStorage.getItem('jsonServerToken') || localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export const createMeeting = async (
	meeting: Omit<Meeting, 'id'>
): Promise<Meeting> => {
	const response = await api.post('/meetings', meeting)
	return response.data
}

export const getMeetingById = async (id: string): Promise<Meeting> => {
	const response = await api.get(`/meetings/${id}`)
	return response.data
}

export const updateMeeting = async (
	id: string,
	meeting: Partial<Meeting>
): Promise<Meeting> => {
	const response = await api.put(`/meetings/${id}`, meeting)
	return response.data
}

export const getMeetings = async (
	userId: string,
	isAdmin: boolean
): Promise<Meeting[]> => {
	try {
		const response = await api.get('/meetings', {
			params: isAdmin ? {} : { createdBy: userId },
		})
		return response.data
	} catch (error: any) {
		throw new Error(
			`Failed to fetch meetings: ${error.message || 'Network error'}`
		)
	}
}

export const deleteMeeting = async (id: string): Promise<void> => {
	await api.delete(`/meetings/${id}`)
}
