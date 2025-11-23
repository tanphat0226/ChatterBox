import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../libs/utils'
import { useRef } from 'react'

const ChatContainer = () => {
	const {
		messages,
		getMessages,
		isMessagesLoading,
		selectedUser,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useChatStore()
	const { authUser } = useAuthStore()

	const bottomRef = useRef(null)

	useEffect(() => {
		if (bottomRef.current && messages) {
			bottomRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		getMessages(selectedUser._id)

		subscribeToMessages()

		return () => {
			unsubscribeFromMessages()
		}
	}, [
		getMessages,
		selectedUser,
		subscribeToMessages,
		unsubscribeFromMessages,
	])

	if (isMessagesLoading)
		return (
			<div className='flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)

	return (
		<div className='flex-1 flex flex-col overflow-auto'>
			<ChatHeader />

			<div className='flex-1 overflow-auto p-4 space-y-4'>
				{messages?.map((msg) => (
					<div
						key={msg._id}
						className={`chat  ${
							msg.senderId === authUser._id
								? 'chat-end'
								: 'chat-start'
						}`}
						ref={bottomRef}
					>
						<div className='chat-image avatar'>
							<div className='size-10 rounded-full border'>
								<img
									src={
										msg.senderId === authUser._id
											? authUser.profilePic
											: selectedUser.profilePic ||
											  '/avatar.png'
									}
									alt={
										msg.senderId === authUser._id
											? authUser.name
											: selectedUser.name || 'User Avatar'
									}
								/>
							</div>
						</div>

						<div className='chat-header mb-1'>
							<time className='text-xs opacity-50 ml-1'>
								{formatMessageTime(msg.createdAt)}
							</time>
						</div>

						<div className='chat-bubble flex flex-col'>
							{msg.image && (
								<img
									src={msg.image}
									alt='Attachment'
									className='sm:max-w-[200px] rounded-md mb-2'
								/>
							)}
							{msg.text && <p>{msg.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</div>
	)
}

export default ChatContainer
