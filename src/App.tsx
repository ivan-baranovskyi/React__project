import React, { JSX } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import MeetingForm from './components/Meetings/MeetingForm'
import MeetingList from './components/Meetings/MeetingList'
import CalendarView from './components/Meetings/CalendarView'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import { useAuth } from './context/AuthContext'
import { Container, CircularProgress, Box } from '@mui/material'

const App: React.FC = () => {
	const { user, loading } = useAuth()

	if (loading) {
		return (
			<Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Container>
		)
	}

	const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
		children,
	}) => {
		if (!user) return <Navigate to='/login' replace />
		return children
	}

	return (
		<Router>
			<Box sx={{ display: 'flex' }}>
				<Sidebar />
				<Box sx={{ flexGrow: 1 }}>
					<Navbar />
					<Container sx={{ mt: 4, ml: '240px' }}>
						<Routes>
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route
								path='/dashboard'
								element={
									<ProtectedRoute>
										<CalendarView />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/meetings'
								element={
									<ProtectedRoute>
										<MeetingList />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/meetings/new'
								element={
									<ProtectedRoute>
										<MeetingForm />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/meetings/edit/:id'
								element={
									<ProtectedRoute>
										<MeetingForm />
									</ProtectedRoute>
								}
							/>
							<Route path='/' element={<Navigate to='/login' replace />} />
						</Routes>
					</Container>
				</Box>
			</Box>
		</Router>
	)
}

export default App
