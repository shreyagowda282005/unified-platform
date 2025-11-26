import { useNavigate } from 'react-router-dom'
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

const campaigns = [
  {
    brand: 'Lumi Skin',
    budget: '$4K - $6K',
    title: 'Summer SPF storytellers',
    location: 'Remote',
    requirements: '2 reels + 1 TikTok',
  },
  {
    brand: 'AeroFit',
    budget: '$6K - $9K',
    title: 'Hybrid athlete series',
    location: 'LA / Remote',
    requirements: '3 shorts + 2 IG stories',
  },
  {
    brand: 'Vista Resorts',
    budget: '$8K - $12K',
    title: 'Coastal escape docu',
    location: 'Portugal',
    requirements: 'Travel vlog + photo set',
  },
]

export const BrowseCampaigns = () => {
  const navigate = useNavigate()

  const handleApply = (campaign: typeof campaigns[0]) => {
    navigate('/influencer/campaigns/apply', { state: { campaign } })
  }

  return (
    <DashboardLayout
      title="Browse campaigns"
      subtitle="Filters for niches, budgets, and geos"
      sidebarItems={sidebarItems}
    >
      <div className="filters card">
        <label>
          Budget range
          <select>
            <option>$1K - $5K</option>
            <option>$5K - $10K</option>
            <option>$10K+</option>
          </select>
        </label>
        <label>
          Niche
          <select>
            <option>Beauty</option>
            <option>Travel</option>
            <option>Tech</option>
          </select>
        </label>
        <label>
          Location
          <select>
            <option>Remote</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
        </label>
        <label>
          Campaign type
          <select>
            <option>Product launch</option>
            <option>Always-on</option>
            <option>Event</option>
          </select>
        </label>
      </div>
      <div className="campaign-grid">
        {campaigns.map((campaign) => (
          <div key={campaign.title} className="card campaign-card">
            <div>
              <span className="pill tiny">{campaign.brand}</span>
              <h3>{campaign.title}</h3>
              <p>{campaign.requirements}</p>
            </div>
            <div className="campaign-meta">
              <p>{campaign.budget}</p>
              <p>{campaign.location}</p>
            </div>
            <button className="cta small" onClick={() => handleApply(campaign)}>
              Apply
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

