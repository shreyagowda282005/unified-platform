import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'
import './MessagesPage.css'

interface User {
  _id: string
  name?: string
  email?: string
  profilePicture?: string
  userType?: string
}

interface Message {
  _id: string
  // socket messages may carry partial user objects; allow either id string or partial user info
  senderId: string | { _id: string; name?: string; email?: string; userType?: string }
  receiverId: string | { _id: string; name?: string }
  content: string
  createdAt: string
  isRead: boolean
}

interface Conversation {
  _id: string
  lastMessage: Message
  unreadCount: number
  otherUser?: User
}

export const MessagesPage = () => {
  const { user, token } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | undefined>(undefined)
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Get the other user from a conversation
  const getOtherUser = (conversation: Conversation): User | null => {
    if (conversation.otherUser) return conversation.otherUser
    
    const lastMsg = conversation.lastMessage
    const senderId = typeof lastMsg.senderId === 'string' ? lastMsg.senderId : lastMsg.senderId._id
    // receiverId not used in this logic, keep lastMsg fields as the source of truth
    
    if (senderId === user?._id) {
      return typeof lastMsg.receiverId === 'string' ? null : lastMsg.receiverId
    } else {
      return typeof lastMsg.senderId === 'string' ? null : lastMsg.senderId
    }
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      // Fetch user details for each conversation
      const conversationsWithUsers = await Promise.all(
        data.map(async (conv: Conversation) => {
          const otherUserId = conv._id
          try {
            const userResponse = await fetch(`${API}/users/${otherUserId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (userResponse.ok) {
              const userData = await userResponse.json()
              return { ...conv, otherUser: userData }
            }
            // Fallback: if lastMessage includes embedded user object, use that
            const last = conv.lastMessage
            const sender = typeof last.senderId === 'object' ? last.senderId : null
            const receiver = typeof last.receiverId === 'object' ? last.receiverId : null
            const fallbackUser = sender && sender._id !== (user?._id) ? sender : receiver
            if (fallbackUser) return { ...conv, otherUser: fallbackUser }
            return { ...conv }
          } catch (error) {
            console.error('Error fetching user:', error)
            return conv
          }
        })
      )
      
      setConversations(conversationsWithUsers)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for a conversation
  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`${API}/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setMessages(data)
      scrollToBottom()
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedConversation || !user) return

    try {
      const response = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedConversation,
          content: messageInput
        })
      })
      
      const newMessage = await response.json()
      
      // Add to local messages
      setMessages(prev => [...prev, newMessage])
      
      // Send via socket (server expects sendMessage(roomId, message))
      const roomId = [user._id, selectedConversation].sort().join('-')
      // the socket service will emit { roomId, message } so pass the message object
      const socketPayload = {
        ...newMessage,
        senderId: user._id || user.id,
        receiverId: selectedConversation
      }
      socketService.sendMessage(roomId, socketPayload)
      
      setMessageInput('')
      scrollToBottom()
      
      // Refresh conversations to update last message
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedConversation || !user) return
    
    const roomId = [user._id, selectedConversation].sort().join('-')
    socketService.emitTyping(roomId, user.name)
    
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false)
    }, 3000)
  }

  // Select a conversation
  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId)
    fetchMessages(userId)
    
    if (user) {
      const roomId = [user._id, userId].sort().join('-')
      socketService.joinRoom(roomId)
    }
  }

  // Initialize
  useEffect(() => {
    if (!user || !token) return

    // connect passing a stable user id (socket auth uses user id)
    socketService.connect(token)
    fetchConversations()

    // Listen for incoming messages
    const handleReceiveMessage = (message: Message) => {
      setMessages(prev => [...prev, message])
      scrollToBottom()
      fetchConversations() // Update conversation list
    }

    // Listen for typing
    const handleUserTyping = () => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 3000)
    }

    socketService.onReceiveMessage(handleReceiveMessage)
    socketService.onUserTyping(handleUserTyping)

    return () => {
      socketService.removeAllListeners()
      socketService.disconnect()
    }
  }, [user, token])

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Get initials for avatar
  const getInitials = (name?: string) => {
    const input = name || ''
    return input
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="messages-page">
        <div className="messages-container">
          <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
            Loading conversations...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Conversations Sidebar */}
        <div className={`conversations-sidebar ${selectedConversation ? 'has-selection' : ''}`}>
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-state">
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = getOtherUser(conv)
                if (!otherUser) return null
                
                return (
                  <div
                    key={conv._id}
                    className={`conversation-item ${selectedConversation === conv._id ? 'active' : ''}`}
                    onClick={() => handleSelectConversation(conv._id)}
                  >
                    <div className="conversation-avatar">
                      {otherUser.profilePicture ? (
                        <img src={otherUser.profilePicture} alt={otherUser.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getInitials(otherUser.name)}
                        </div>
                      )}
                    </div>
                    
                    <div className="conversation-details">
                      <div className="conversation-top">
                        <h4>{otherUser.name}</h4>
                        <span className="conversation-time">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      
                      <div className="conversation-bottom">
                        <p className="last-message">{conv.lastMessage.content}</p>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                {(() => {
                  const conv = conversations.find(c => c._id === selectedConversation)
                  const otherUser = conv ? getOtherUser(conv) : null
                  
                  return otherUser ? (
                    <>
                      <div className="chat-avatar">
                        {otherUser.profilePicture ? (
                          <img src={otherUser.profilePicture} alt={otherUser.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {getInitials(otherUser.name)}
                          </div>
                        )}
                      </div>
                      <h3>{otherUser.name}</h3>
                    </>
                  ) : null
                })()}
              </div>
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {messages.map((message) => {
                const senderId = typeof message.senderId === 'string' 
                  ? message.senderId 
                  : message.senderId._id
                
                const isSent = senderId === user?._id
                
                return (
                  <div key={message._id} className={`message ${isSent ? 'sent' : 'received'}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {isTyping && (
                <div className="message received">
                  <div className="typing-indicator">
                    <span>typing</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value)
                  handleTyping()
                }}
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a conversation to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  )
}