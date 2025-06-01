import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Container, Typography } from '@mui/material'
import { login } from '../../services/auth'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
	const navigate = useNavigate()
	const formik = useFormik({
		initialValues: { email: '', password: '' },
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email').required('Required'),
			password: Yup.string().min(6, 'Too short').required('Required'),
		}),
		onSubmit: async (values: { email: string; password: string }) => {
			try {
				await login(values.email, values.password)
				navigate('/dashboard')
			} catch (error) {
				alert('Login failed')
			}
		},
	})

	return (
		<Container maxWidth='sm'>
			<Typography variant='h4'>Login</Typography>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					label='Email'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('email')} // Includes name="email"
					error={formik.touched.email && !!formik.errors.email}
					helperText={formik.touched.email && formik.errors.email}
				/>
				<TextField
					label='Password'
					type='password'
					fullWidth
					margin='normal'
					{...formik.getFieldProps('password')} // Includes name="password"
					error={formik.touched.password && !!formik.errors.password}
					helperText={formik.touched.password && formik.errors.password}
				/>
				<Button type='submit' variant='contained' color='primary' fullWidth>
					Login
				</Button>
			</form>
		</Container>
	)
}

export default Login
