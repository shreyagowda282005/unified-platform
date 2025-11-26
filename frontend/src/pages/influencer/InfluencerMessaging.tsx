import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/influencer/dashboard' },
  { label: 'My Profile', href: '/influencer/profile' },
  { label: 'Portfolio Uploads', href: '/influencer/portfolio' },
  { label: 'My Applications', href: '/influencer/campaigns' },
  { label: 'Messaging', href: '/influencer/messaging' },
  { label: 'Earnings', href: '/influencer/earnings' },
  { label: 'Settings', href: '/settings' },
]

const chats = [
  { name: 'Nova Glow', preview: 'Can you share story drafts?', unread: 2 },
  { name: 'Vista Resorts', preview: 'Travel brief attached ✈️', unread: 0 },
  { name: 'StrideX', preview: 'Approved your concept!', unread: 0 },
]

const messages = [
  { from: 'them', text: 'We loved your pitch! Could you customize the hook?' },
  { from: 'me', text: 'Absolutely, I can highlight the SPF science upfront.' },
  { from: 'them', text: 'Perfect. Sharing moodboard shortly.' },
]

export const InfluencerMessaging = () => (
  <DashboardLayout
    title="Messaging"
    subtitle="Secure real-time chat with brands"
    sidebarItems={sidebarItems}
  >
    <div className="messaging">
      <div className="chat-list card">
        {chats.map((chat) => (
          <div key={chat.name} className="chat-preview">
            <div>
              <h4>{chat.name}</h4>
              <p>{chat.preview}</p>
            </div>
            {chat.unread > 0 && <span className="pill tiny">{chat.unread}</span>}
          </div>
        ))}
      </div>
      <div className="chat-window card">
        <h3>Nova Glow launch</h3>
        <div className="message-feed">
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.from === 'me' ? 'me' : 'them'}`}>
              <div className="message-text">{msg.text}</div>
              <div className="message-meta">
                <span className="tiny">{msg.from === 'me' ? 'Seen' : '09:30'}</span>
              </div>
            </div>
          ))}
          <div className="typing-indicator">
            <div className="typing-dot" />
          </div>
        </div>
        <div className="input-row">
          <input placeholder="Type a message..." />
          <button className="cta small">Send</button>
        </div>
      </div>
    </div>
  </DashboardLayout>
)

