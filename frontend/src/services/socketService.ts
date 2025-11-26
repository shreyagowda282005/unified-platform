// socketService.ts
import io, { Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private isConnected: boolean = false

  connect(token: string) {
    try {
      if (this.socket && this.isConnected) {
        return
      }

      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
      
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      this.socket.on('connect', () => {
        console.log('Socket connected')
        this.isConnected = true
      })

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected')
        this.isConnected = false
      })

      this.socket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message)
        this.isConnected = false
      })
    } catch (error) {
      console.warn('Failed to initialize socket:', error)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinRoom(roomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', roomId)
    }
  }

  sendMessage(roomId: string, message: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', { roomId, message })
    }
  }

  emitTyping(roomId: string, userName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { roomId, userName })
    }
  }

  onReceiveMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('receiveMessage', callback)
    }
  }

  onUserTyping(callback: () => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback)
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export const socketService = new SocketService()