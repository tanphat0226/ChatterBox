import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

const ProtectedRoute = ({ user }) => {
	if (!user) return <Navigate to='/login' replace />
	return <Outlet />
}

const App = () => {
	const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
	const { theme } = useThemeStore()

	useEffect(() => {
		checkAuth()
	}, [checkAuth])
	console.log(onlineUsers)

	if (isCheckingAuth && !authUser)
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader className='size-10 animate-spin' />
			</div>
		)

	return (
		<div data-theme={theme}>
			<Navbar />

			<Routes>
				{/* Protected Routes*/}
				<Route element={<ProtectedRoute user={authUser} />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/profile' element={<ProfilePage />} />
				</Route>

				{/* Public Routes */}
				<Route
					path='/signup'
					element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
				/>
				<Route
					path='/login'
					element={!authUser ? <LoginPage /> : <Navigate to='/' />}
				/>
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>

			<Toaster />
		</div>
	)
}

export default App
