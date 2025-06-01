import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { getUserData } from '../services/auth'
import { User } from '../types'

interface AuthContextType {
	user: FirebaseUser | null
	isAdmin: boolean
	loading: boolean
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAdmin: false,
	loading: true,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<FirebaseUser | null>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			if (firebaseUser) {
				setUser(firebaseUser)
				try {
					const userData: User = await getUserData(firebaseUser.uid)
					setIsAdmin(userData.role === 'admin')
				} catch (error: any) {
					console.error('Error fetching user role:', error.message || error)
					setIsAdmin(false)
				}
			} else {
				setUser(null)
				setIsAdmin(false)
			}
			setLoading(false)
		})
		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider value={{ user, isAdmin, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
