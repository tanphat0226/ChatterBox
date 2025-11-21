import toast from 'react-hot-toast'
import { axiosInstance } from '../libs/axios'
import { create } from 'zustand'

export const useChatStore = create((set) => ({
	messages: [],
	user: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	onlineUsers: [],

	getUsers: async () => {
		set({ isUsersLoading: true })
		try {
			const res = await axiosInstance.get('/messages/users')
			set({ users: res.data })
		} catch (error) {
			console.error('Error fetching users:', error)
			toast.error(
				error.response?.data?.message || 'Failed to fetch users'
			)
		} finally {
			set({ isUsersLoading: false })
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true })
		try {
			const res = await axiosInstance.get(`/messages/${userId}`)
			set({ messages: res.data })
		} catch (error) {
			console.error('Error fetching messages:', error)
			toast.error(
				error.response?.data?.message || 'Failed to fetch messages'
			)
		} finally {
			set({ isMessagesLoading: false })
		}
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}))
