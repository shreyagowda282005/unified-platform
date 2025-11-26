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

const campaigns = [
  { id: 1, title: 'Glow-up drops', budget: '$24K', status: 'Reviewing', applicants: 64 },
  { id: 2, title: 'Hybrid athlete series', budget: '$32K', status: 'Live', applicants: 88 },
  { id: 3, title: 'Coastal escape docu', budget: '$60K', status: 'Closed', applicants: 112 },
]

export const ManageCampaigns = () => {
  const handleEdit = (campaign: typeof campaigns[0]) => {
    // TODO: Navigate to edit page or open modal
    alert(`Editing campaign: ${campaign.title}`)
  }

  const handleClose = (campaign: typeof campaigns[0]) => {
    if (confirm(`Are you sure you want to close "${campaign.title}"?`)) {
      // TODO: Implement close campaign API call
      alert(`Campaign "${campaign.title}" closed`)
    }
  }

  return (
    <DashboardLayout
      title="Manage campaigns"
      subtitle="Track performance and talent pipeline"
      sidebarItems={sidebarItems}
    >
      <div className="card table">
        <div className="table-head">
          <span>Campaign</span>
          <span>Budget</span>
          <span>Status</span>
          <span>Applicants</span>
          <span>Actions</span>
        </div>
        {campaigns.map((campaign) => (
          <div className="table-row" key={campaign.id}>
            <span>{campaign.title}</span>
            <span>{campaign.budget}</span>
            <span className={`pill tiny ${campaign.status === 'Live' ? 'success' : 'warning'}`}>
              {campaign.status}
            </span>
            <span>{campaign.applicants}</span>
            <span className="table-actions">
              <button className="link tiny" onClick={() => handleEdit(campaign)}>Edit</button>
              <button className="link tiny" onClick={() => handleClose(campaign)}>Close</button>
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

