import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setRoom, setUser } from '../store/chatSlice'
import { motion } from 'framer-motion'

const rooms = ['General', 'Tech', 'Random', 'Gaming']

export default function RoomSelector({ onJoin }: { onJoin: () => void }) {
  const [username, setUsername] = useState('')
  const [room, setRoomLocal] = useState('General')
  const dispatch = useDispatch()

  const handleJoin = () => {
    if (username.trim()) {
      dispatch(setUser(username))
      dispatch(setRoom(room))
      onJoin()
    }
  }

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

      <motion.div
        className='bg-white rounded-2xl shadow-xl p-6 w-[90vw] max-w-sm space-y-4 z-10 '
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <h1 className='text-xl font-bold text-center'>Join a Room</h1>
        <input
          type='text'
          placeholder='Enter your name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full px-4 py-2 border rounded'
        />
        <select
          value={room}
          onChange={(e) => setRoomLocal(e.target.value)}
          className='w-full px-4 py-2 border rounded'
        >
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          onClick={handleJoin}
          className='w-full bg-[#006AFF] text-white py-2 rounded hover:bg-blue-600'
        >
          Join
        </button>
      </motion.div>
    </motion.div>
  )
}
