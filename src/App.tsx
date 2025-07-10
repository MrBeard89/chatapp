import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from './store/store'
import { addMessage, setMessages } from './store/chatSlice'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
import './index.css'

let socket: Socket

export default function ChatApp() {
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.chat.messages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    socket = io('http://localhost:3001')

    socket.on('chat message', (msg) => {
      dispatch(addMessage(msg))
    })

    return () => {
      socket.disconnect()
    }
  }, [dispatch])

  const handleSend = () => {
    if (input.trim()) {
      socket.emit('chat message', input)
      dispatch(addMessage({ text: input, self: true }))
      setInput('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='h-screen w-screen bg-[#006AFF] flex flex-col items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl h-full max-h-[90vh] flex flex-col'>
        <div className='bg-[#006AFF] text-white text-xl font-bold p-4 rounded-t-2xl'>Messenger</div>
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] p-3 rounded-xl text-white ${
                msg.self ? 'bg-[#006AFF] self-end ml-auto' : 'bg-[#E4E6EB] text-black'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className='p-4 border-t flex gap-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className='flex-1'
            placeholder='Type a message...'
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}
