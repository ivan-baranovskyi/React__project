import { auth } from '../firebase'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth'
import axios from 'axios'
import { User } from '../types'

export const register = async (
	email: string,
	password: string,
	username: string
): Promise<string> => {
	try {
		// Register with Firebase
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)
		const token = await userCredential.user.getIdToken()
		localStorage.setItem('token', token)

		// Register with JSON Server
		const response = await axios.post('http://localhost:3001/register', {
			email,
			username,
		})
		const jsonServerToken = response.data.token
		localStorage.setItem('jsonServerToken', jsonServerToken)

		return token
	} catch (error: any) {
		throw new Error(`Registration failed: ${error.message || 'Unknown error'}`)
	}
}

export const login = async (email: string, password: string): Promise<void> => {
	try {
		// Login with Firebase
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)
		const token = await userCredential.user.getIdToken()
		localStorage.setItem('token', token)

		// Ensure user exists in JSON Server
		const response = await axios.post('http://localhost:3001/register', {
			email,
			username: email.split('@')[0], // Fallback username
		})
		const jsonServerToken = response.data.token
		localStorage.setItem('jsonServerToken', jsonServerToken)
	} catch (error: any) {
		throw new Error(`Login failed: ${error.message || 'Unknown error'}`)
	}
}

export const logout = async (): Promise<void> => {
	await signOut(auth)
	localStorage.removeItem('token')
	localStorage.removeItem('jsonServerToken')
}

export const getUserData = async (userId: string): Promise<User> => {
	try {
		const response = await axios.get(`http://localhost:3001/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${
					localStorage.getItem('jsonServerToken') ||
					localStorage.getItem('token')
				}`,
			},
		})
		return response.data
	} catch (error: any) {
		throw new Error(
			`Failed to fetch user data: ${error.message || 'Unknown error'}`
		)
	}
}
