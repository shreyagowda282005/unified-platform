import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/brand/dashboard' },
  { label: 'Create Campaign', href: '/brand/create-campaign' },
  { label: 'Manage Campaigns', href: '/brand/manage-campaigns' },
  { label: 'Browse Influencers', href: '/brand/browse-influencers' },
  { label: 'Messaging', href: '/brand/messaging' },
  { label: 'Payments', href: '/brand/payments' },
  { label: 'Settings', href: '/settings' },
]

export const BrandMessaging = () => (
  <DashboardLayout
    title="Messaging"
    subtitle="Coordinate briefs, approvals, and assets"
    sidebarItems={sidebarItems}
  >
    <div className="messaging">
      <div className="chat-list card">
        <div className="chat-preview">
          <div>
            <h4>Ayla Rivers</h4>
            <p>Shared revised hook + CTA</p>
          </div>
          <span className="pill tiny">1</span>
        </div>
        <div className="chat-preview">
          <div>
            <h4>Leo Miles</h4>
            <p>Uploaded travel footage</p>
          </div>
        </div>
      </div>
      <div className="chat-window card">
        <h3>Glow-up drops · Ayla Rivers</h3>
        <div className="message-feed">
          <div className="bubble them">
            <div className="message-text">Can we align on CTA placement? Need to drive to waitlist.</div>
            <div className="message-meta">
              <span className="tiny">09:32</span>
            </div>
          </div>
          <div className="bubble me">
            <div className="message-text">Absolutely. Adding CTA overlay on frame 7 + 8.</div>
            <div className="message-meta">
              <span className="tiny">09:33</span>
            </div>
          </div>
        </div>
        <div className="input-row">
          <input placeholder="Drop a message or file link..." />
          <button className="cta small">Send</button>
        </div>
      </div>
    </div>
  </DashboardLayout>
)

