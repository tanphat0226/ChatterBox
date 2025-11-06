import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'

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
}))
