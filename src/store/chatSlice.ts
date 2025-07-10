import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Message {
  text: string
  self?: boolean
}

interface ChatState {
  messages: Message[]
}

const initialState: ChatState = {
  messages: [],
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
  },
})

export const { addMessage, setMessages } = chatSlice.actions
export default chatSlice.reducer
