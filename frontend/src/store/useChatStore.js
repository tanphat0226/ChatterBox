import toast from 'react-hot-toast'
import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
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

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get()
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			toast.error(
				error.response?.data?.message || 'Failed to send message'
			)
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get()
		if (!selectedUser) return null

		const socket = useAuthStore.getState().socket

		socket.on('newMessage', (newMessage) => {
			const isMessageSentForSelectedUser =
				newMessage.senderId !== selectedUser._id
			if (!isMessageSentForSelectedUser) return

			set({ messages: [...get().messages, newMessage] })
		})
	},
	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket
		socket.off('newMessage')
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}))
