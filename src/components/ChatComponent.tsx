import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../store/store'
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
import EmojiPicker from 'emoji-picker-react'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001')

interface MessageType {
  user: string
  text: string
  time: string
}

export default function ChatComponent({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, room }: { user: string; room: string } = useSelector(
    (state: RootState) => state.chat
  )

  const sendMessage = () => {
    if (message !== '') {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      socket.emit('chat message', { user, room, text: message, time })
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  useEffect(() => {
    socket.emit('join room', { user, room })
    socket.on('chat message', (msg: MessageType) => {
      setMessages((prev) => [...prev, msg])
    })
    return () => {
      socket.off('chat message')
    }
  }, [room, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <motion.div
      className='relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Background */}
      <motion.div
        className='absolute inset-0 z-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 animate-pulse'
          style={{ zIndex: -1 }}
        />
        <div
          className='absolute top-0 left-0 w-full h-full bg-noise opacity-10 mix-blend-soft-light pointer-events-none'
          style={{ zIndex: -1 }}
        />
      </motion.div>

      {/* Chat Container */}
      <motion.div
        className='flex flex-col h-screen w-full max-w-2xl mx-auto bg-[#598ffe] z-10 '
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className='flex justify-between items-center p-4 bg-blue-600 text-white'>
          <button
            onClick={onBack}
            className='text-white hover:underline hover:cursor-pointer hover:bg-blue-800 hover:rounded-md p-2'
          >
            ← Back
          </button>
          <h2 className='text-lg font-semibold'>Room: {room}</h2>
          <span className='w-10' />
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-xl max-w-xs break-words ${
                msg.user === user
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className='text-sm font-semibold'>{msg.user}</div>
              <div>{msg.text}</div>
              <div className='text-xs text-gray-300 text-right mt-1'>{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className='relative p-4 bg-white flex items-center gap-2'>
          <div className='relative'>
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className='text-2xl px-2 py-1 rounded hover:bg-gray-100'
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className='absolute bottom-12 left-0 z-50 shadow-xl'>
                <EmojiPicker
                  onEmojiClick={(emojiData) => setMessage((prev) => prev + emojiData.emoji)}
                  // theme="light"
                />
              </div>
            )}
          </div>

          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder='Type your message...'
            className='flex-1 border rounded px-4 py-2 min-w-[50%]'
          />
          <button
            onClick={sendMessage}
            disabled={message === ''}
            className='bg-[#006AFF] text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
          >
            Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
