import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration using environment variables
const firebaseConfig = {
	apiKey: 'AIzaSyCuAasXizWcyGuQrtuzGTeiS-um9G_NCwY',
	authDomain: 'meetings-d758f.firebaseapp.com',
	projectId: 'meetings-d758f',
	storageBucket: 'meetings-d758f.firebasestorage.app',
	messagingSenderId: '774100047639',
	appId: '1:774100047639:web:ce89bd8bc145e81e178952',
	measurementId: 'G-C52LPMEPK5',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Authentication
export const auth = getAuth(app)
