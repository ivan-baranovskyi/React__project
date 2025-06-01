import React from 'react'
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../services/auth'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useNavigate } from 'react-router-dom'

const Sidebar: React.FC = () => {
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
		<Drawer
			variant='permanent'
			sx={{
				width: 240,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
			}}
		>
			<Typography variant='h6' sx={{ p: 2 }}>
				Meeting Reservations
			</Typography>
			<Divider />
			<List>
				{user ? (
					<>
						<ListItem component={Link} to='/dashboard'>
							<ListItemIcon>
								<CalendarTodayIcon />
							</ListItemIcon>
							<ListItemText primary='Dashboard' />
						</ListItem>
						<ListItem component={Link} to='/meetings'>
							<ListItemIcon>
								<MeetingRoomIcon />
							</ListItemIcon>
							<ListItemText primary='Meetings' />
						</ListItem>
						<ListItem onClick={handleLogout}>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary='Logout' />
						</ListItem>
					</>
				) : (
					<>
						<ListItem component={Link} to='/login'>
							<ListItemIcon>
								<LoginIcon />
							</ListItemIcon>
							<ListItemText primary='Login' />
						</ListItem>
						<ListItem component={Link} to='/register'>
							<ListItemIcon>
								<PersonAddIcon />
							</ListItemIcon>
							<ListItemText primary='Register' />
						</ListItem>
					</>
				)}
			</List>
		</Drawer>
	)
}

export default Sidebar
