import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
	TextField,
	Button,
	Container,
	Typography,
	Snackbar,
	Alert,
	Link,
} from '@mui/material'
import { register } from '../../services/auth'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

const Register: React.FC = () => {
	const navigate = useNavigate()
	const [snackbar, setSnackbar] = useState<{
		open: boolean
		message: string
		severity: 'error' | 'success'
	}>({ open: false, message: '', severity: 'error' })

	const formik = useFormik({
		initialValues: { username: '', email: '', password: '' }, // Fixed typo: Removed "Lot 4"
		validationSchema: Yup.object({
			username: Yup.string().required('Required'),
			email: Yup.string().email('Invalid email').required('Required'),
			password: Yup.string().min(6, 'Too short').required('Required'),
		}),
		onSubmit: async values => {
			try {
				const token = await register(
					values.email,
					values.password,
					values.username
				)
				localStorage.setItem('token', token)
				setSnackbar({
					open: true,
					message: 'Registration successful',
					severity: 'success',
				})
				navigate('/dashboard')
			} catch (error: any) {
				setSnackbar({
					open: true,
					message: error.message || 'Registration failed',
					severity: 'error',
				})
			}
		},
	})

	return (
		<Container maxWidth='sm'>
			<Typography variant='h4'>Register</Typography>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					label='Username'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('username')}
					error={formik.touched.username && !!formik.errors.username}
					helperText={formik.touched.username && formik.errors.username}
				/>
				<TextField
					label='Email'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('email')}
					error={formik.touched.email && !!formik.errors.email}
					helperText={formik.touched.email && formik.errors.email}
				/>
				<TextField
					label='Password'
					type='password'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('password')}
					error={formik.touched.password && !!formik.errors.password}
					helperText={formik.touched.password && formik.errors.password}
				/>
				<Button
					type='submit'
					variant='contained'
					color='primary'
					fullWidth
					sx={{ mt: 2 }}
				>
					Register
				</Button>
			</form>
			<Typography sx={{ mt: 2 }}>
				Already have an account?{' '}
				<Link component={RouterLink} to='/login'>
					Login
				</Link>
			</Typography>
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

export default Register
