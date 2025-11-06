import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

const ProtectedRoute = ({ user }) => {
	if (!user) return <Navigate to='/login' replace />
	return <Outlet />
}

const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	if (isCheckingAuth && !authUser)
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader className='size-10 animate-spin' />
			</div>
		)

	return (
		<div>
			<Navbar />

			<Routes>
				{/* Protected Routes*/}
				<Route element={<ProtectedRoute user={authUser} />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/profile' element={<ProfilePage />} />
				</Route>

				{/* Public Routes */}
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	)
}

export default App
