import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const SOCKET_SERVER_URL = 'http://localhost:5001'

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	socket: null,
	onlineUsers: [],

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')

			set({ authUser: res.data })

			// Connect to socket after auth check
			get().connectSocket()
		} catch (error) {
			console.error('Error during auth check:', error)
			set({ authUser: null })
		} finally {
			set({ isCheckingAuth: false })
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true })
		try {
			const res = await axiosInstance.post('/auth/signup', data)
			set({ authUser: res.data })
			toast.success('Signup successful!')

			// Connect to socket after signup
			get().connectSocket()
		} catch (error) {
			toast.error(error.response?.data?.message || 'Signup failed')
		} finally {
			set({ isSigningUp: false })
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true })
		try {
			const res = await axiosInstance.post('/auth/login', data)
			set({ authUser: res.data })
			toast.success('Login successful!')

			// Connect to socket after login
			get().connectSocket()
		} catch (error) {
			toast.error(error.response?.data?.message || 'Login failed')
		} finally {
			set({ isLoggingIn: false })
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout')
			set({ authUser: null })
			toast.success('Logged out successfully')

			// Disconnect from socket after logout
			get().disconnectSocket()
		} catch (error) {
			toast.error(error.response?.data?.message || 'Logout failed')
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })

		try {
			const res = await axiosInstance.put('/auth/update-profile', data)
			set({ authUser: res.data })
			toast.success('Profile updated successfully')
		} catch (error) {
			console.error('Error updating profile:', error)
			toast.error(
				error.response?.data?.message || 'Profile update failed'
			)
		} finally {
			set({ isUpdatingProfile: false })
		}
	},

	connectSocket: () => {
		const { authUser } = get()
		if (!authUser || get().socket?.connected) return

		// Establish socket connection
		const socket = io(SOCKET_SERVER_URL, {
			query: { userId: authUser._id },
		})

		socket.on()
		set({ socket })

		socket.on('getOnlineUsers', (userIds) => {
			set({ onlineUsers: userIds })
		})
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect()
		set({ socket: null })
	},
}))
