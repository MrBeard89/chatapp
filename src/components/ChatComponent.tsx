import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from './../store/store'
import { addMessage } from '../store/chatSlice'
import { io, Socket } from 'socket.io-client'
import { motion } from 'framer-motion'

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001')

export default function ChatComponent({ onBack }: { onBack: () => void }) {
  const dispatch = useDispatch()
  const { user, currentRoom, messages } = useSelector((state: RootState) => state.chat)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.emit('join room', currentRoom)
    socket.on('chat message', (msg) => {
      dispatch(addMessage({ ...msg, self: false }))
    })
    return () => {
      socket.off('chat message')
    }
  }, [currentRoom, dispatch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      const message = { text: input, user, room: currentRoom, self: true }
      dispatch(addMessage(message))
      socket.emit('chat message', message)
      setInput('')
    }
  }

  return (
    <motion.div
      className='flex flex-col h-screen bg-gray-100'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className='flex items-center justify-between p-4 text-white bg-[#006AFF] text-lg font-semibold'>
        <button
          onClick={onBack}
          className='text-white bg-[#004FCC] px-3 py-1 rounded hover:bg-[#003DA6]'
        >
          ⬅ Back
        </button>
        <span className='truncate max-w-[60%] text-center'>Room: {currentRoom}</span>
        <div className='w-16' />
      </div>
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`max-w-[85%] px-4 py-2 rounded-lg text-white break-words ${
              msg.self ? 'bg-[#006AFF] ml-auto' : 'bg-gray-400'
            }`}
          >
            <div className='text-xs font-bold'>{msg.user}</div>
            <div>{msg.text}</div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className='p-2 bg-white flex gap-2 items-center'>
        <input
          className='flex-1 border rounded px-4 py-2 text-sm'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder='Type a message...'
        />
        <button
          onClick={handleSend}
          className='bg-[#006AFF] text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Send
        </button>
      </div>
    </motion.div>
  )
}
