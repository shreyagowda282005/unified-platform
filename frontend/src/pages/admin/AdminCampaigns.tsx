import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

const campaigns = [
  { title: 'Glow-up drops', owner: 'Nova Glow', status: 'Pending' },
  { title: 'Hybrid athlete series', owner: 'AeroFit', status: 'Approved' },
]

export const AdminCampaigns = () => (
  <DashboardLayout
    title="Campaign approvals"
    subtitle="Approve or remove sensitive campaigns"
    sidebarItems={sidebarItems}
  >
    <div className="card table">
      <div className="table-head">
        <span>Campaign</span>
        <span>Brand</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {campaigns.map((campaign) => (
        <div className="table-row" key={campaign.title}>
          <span>{campaign.title}</span>
          <span>{campaign.owner}</span>
          <span className={`pill tiny ${campaign.status === 'Approved' ? 'success' : 'warning'}`}>
            {campaign.status}
          </span>
          <span>
            <button className="link tiny">Approve</button>
            <button className="link tiny warning">Remove</button>
          </span>
        </div>
      ))}
    </div>
  </DashboardLayout>
)

