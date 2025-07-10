import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Message {
  text: string
  user: string
  room: string
  self?: boolean
}

interface ChatState {
  messages: Message[]
  currentRoom: string
  user: string
}

const initialState: ChatState = {
  messages: [],
  currentRoom: 'general',
  user: `User${Math.floor(Math.random() * 1000)}`,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    setRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload
      state.messages = [] // clear messages on room switch
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload
    },
  },
})

export const { addMessage, setMessages, setRoom, setUser } = chatSlice.actions
export default chatSlice.reducer
