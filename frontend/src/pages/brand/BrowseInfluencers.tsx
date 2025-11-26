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

const influencers = [
  { name: 'Ayla Rivers', category: 'Beauty', followers: '210K', engagement: '5.6%' },
  { name: 'Leo Miles', category: 'Travel', followers: '480K', engagement: '4.1%' },
  { name: 'Mara Holt', category: 'Fitness', followers: '320K', engagement: '6.2%' },
]

export const BrowseInfluencers = () => (
  <DashboardLayout
    title="Browse influencers"
    subtitle="Filter by category, followers, and engagement"
    sidebarItems={sidebarItems}
  >
    <div className="filters card">
      <label>
        Category
        <select>
          <option>Beauty</option>
          <option>Travel</option>
          <option>Wellness</option>
        </select>
      </label>
      <label>
        Location
        <select>
          <option>Global</option>
          <option>US / Canada</option>
          <option>Europe</option>
        </select>
      </label>
      <label>
        Followers
        <select>
          <option>50K - 200K</option>
          <option>200K - 500K</option>
          <option>500K+</option>
        </select>
      </label>
      <label>
        Engagement
        <select>
          <option>3%+</option>
          <option>5%+</option>
          <option>7%+</option>
        </select>
      </label>
    </div>
    <div className="campaign-grid">
      {influencers.map((creator) => (
        <div key={creator.name} className="card influencer-card">
          <div>
            <h3>{creator.name}</h3>
            <p>{creator.category}</p>
          </div>
          <div className="creator-meta">
            <p>{creator.followers} followers</p>
            <p>{creator.engagement} engagement</p>
          </div>
          <div className="creator-actions">
            <a className="link tiny" href="/influencer/profile">
              View profile
            </a>
            <button className="cta small ghost">Invite</button>
          </div>
        </div>
      ))}
    </div>
  </DashboardLayout>
)

