import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../services/auth'

const Navbar: React.FC = () => {
	const { user } = useAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			await logout()
			navigate('/login')
		} catch (error: any) {
			alert('Logout failed: ' + (error.message || 'Unknown error'))
		}
	}

	return (
		<AppBar position='static'>
			<Toolbar>
				<Typography variant='h6' sx={{ flexGrow: 1 }}>
					Meeting Reservations
				</Typography>
				<Box>
					{user ? (
						<>
							<Button color='inherit' component={Link} to='/dashboard'>
								Dashboard
							</Button>
							<Button color='inherit' component={Link} to='/meetings'>
								Meetings
							</Button>
							<Button color='inherit' onClick={handleLogout}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button color='inherit' component={Link} to='/login'>
								Login
							</Button>
							<Button color='inherit' component={Link} to='/register'>
								Register
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navbar
