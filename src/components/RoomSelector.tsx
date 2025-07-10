
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setRoom, setUser } from '../store/chatSlice'
import { motion } from 'framer-motion'

const rooms = ['general', 'tech', 'random', 'gaming']

export default function RoomSelector({ onJoin }: { onJoin: () => void }) {
  const [username, setUsername] = useState('')
  const [room, setRoomLocal] = useState('general')
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
      className='flex flex-col items-center justify-center h-screen bg-[#006AFF] p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4'
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
