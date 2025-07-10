import { useState } from 'react'
import ChatComponent from './components/ChatComponent'
import RoomSelector from './components/RoomSelector'
import './index.css'
import { AnimatePresence } from 'framer-motion'

function App() {
  const [joined, setJoined] = useState(false)

  return (
    <AnimatePresence mode='wait'>
      {joined ? (
        <ChatComponent key='chat' onBack={() => setJoined(false)} />
      ) : (
        <RoomSelector key='room' onJoin={() => setJoined(true)} />
      )}
    </AnimatePresence>
  )
}

export default App
