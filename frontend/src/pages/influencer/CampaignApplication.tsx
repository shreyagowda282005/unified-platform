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

export const CampaignApplication = () => (
  <DashboardLayout
    title="Campaign brief"
    subtitle="Review deliverables before applying"
    sidebarItems={sidebarItems}
    actionSlot={<button className="cta">Submit application</button>}
  >
    <div className="card">
      <span className="pill tiny">Vista Resorts</span>
      <h3>Coastal escape docu series</h3>
      <p className="muted">Budget $8K - $12K · Timeline Jul 5 - Aug 12</p>
      <section>
        <h4>Full description</h4>
        <p>
          Produce a three-part travel diary capturing our Azores resort, spa rituals, and culinary story. Highlight
          slow-luxury moments and sustainability.
        </p>
      </section>
      <section>
        <h4>Deliverables</h4>
        <ul className="list">
          <li>1x long-form YouTube vlog (8-10 min)</li>
          <li>3x Instagram reels</li>
          <li>15-photo editorial set</li>
        </ul>
      </section>
      <section>
        <h4>Apply with message</h4>
        <textarea rows={4} placeholder="Share concept, hook, and timeline." />
      </section>
    </div>
  </DashboardLayout>
)

