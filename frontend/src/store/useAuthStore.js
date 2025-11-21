import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')

			set({ authUser: res.data })
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
			toast.success('Signup successful!')
			set({ authUser: res.data })
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
			toast.success('Login successful!')
			set({ authUser: res.data })
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
}))
