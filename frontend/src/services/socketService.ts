import { io, Socket } from 'socket.io-client'

interface Message {
  _id: string
  senderId: string | { _id: string; name: string }
  receiverId: string | { _id: string; name: string }
  content: string
  createdAt: string
  isRead: boolean
}

interface TypingData {
  userName: string
  userId: string
}

class SocketService {
  private socket: Socket | null = null
  private readonly SOCKET_URL = 'http://localhost:5000'

  connect(token: string) {
    if (this.socket?.connected) {
      return
    }

    this.socket = io(this.SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join-room', roomId)
      console.log('Joined room:', roomId)
    }
  }

  sendMessage(roomId: string, message: Message) {
    if (this.socket) {
      this.socket.emit('send-message', {
        roomId,
        message
      })
    }
  }

  onReceiveMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('receive-message', (data: { message: Message }) => {
        callback(data.message)
      })
    }
  }

  emitTyping(roomId: string, userName: string) {
    if (this.socket) {
      this.socket.emit('typing', {
        roomId,
        userName
      })
    }
  }

  onUserTyping(callback: (data: TypingData) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback)
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export const socketService = new SocketService()