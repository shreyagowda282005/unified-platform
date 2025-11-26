import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { campaignService } from '../../services/campaignService'

const sidebarItems = [
  { label: 'Dashboard', href: '/brand/dashboard' },
  { label: 'Create Campaign', href: '/brand/create-campaign' },
  { label: 'Manage Campaigns', href: '/brand/manage-campaigns' },
  { label: 'Browse Influencers', href: '/brand/browse-influencers' },
  { label: 'Messaging', href: '/brand/messaging' },
  { label: 'Payments', href: '/brand/payments' },
  { label: 'Settings', href: '/settings' },
]

export const CreateCampaign = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'Beauty',
    location: '',
    deadline: '',
    deliverables: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement campaign creation API call
      await campaignService.createCampaign(formData)
      alert('Campaign created successfully!')
      navigate('/brand/manage-campaigns')
    } catch (error) {
      alert('Failed to create campaign. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout
      title="Create campaign"
      subtitle="Share a clear brief, deliverables, and payouts"
      sidebarItems={sidebarItems}
      actionSlot={<button className="cta" onClick={handleSubmit} disabled={loading}>{loading ? 'Publishing...' : 'Publish campaign'}</button>}
    >
    <form className="card form" onSubmit={handleSubmit}>
      <label>
        Title
        <input 
          placeholder="Holiday glow-up series" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </label>
      <label>
        Description
        <textarea 
          rows={4} 
          placeholder="Tell creators about the story, tone, and key deliverables."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </label>
      <div className="grid two">
        <label>
          Budget
          <input 
            type="number" 
            placeholder="12000" 
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            required
          />
        </label>
        <label>
          Niche / category
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option>Beauty</option>
            <option>Travel</option>
            <option>Wellness</option>
            <option>Fashion</option>
            <option>Tech</option>
            <option>Fitness</option>
          </select>
        </label>
      </div>
      <div className="grid two">
        <label>
          Location
          <input 
            placeholder="Hybrid · Los Angeles" 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </label>
        <label>
          Deadline
          <input 
            type="date" 
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            required
          />
        </label>
      </div>
      <label>
        Deliverables
        <textarea 
          rows={3} 
          placeholder="3 reels, 2 TikToks, 1 blog"
          value={formData.deliverables}
          onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
          required
        />
      </label>
    </form>
  </DashboardLayout>
  )
}

