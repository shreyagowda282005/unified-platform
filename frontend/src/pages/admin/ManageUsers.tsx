import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

const users = [
  { name: 'Ayla Rivers', type: 'Influencer', status: 'Active' },
  { name: 'Nova Glow', type: 'Brand', status: 'Active' },
  { name: 'StrideX', type: 'Brand', status: 'Flagged' },
]

export const ManageUsers = () => (
  <DashboardLayout title="Manage users" subtitle="Search, ban, or elevate accounts" sidebarItems={sidebarItems}>
    <div className="card">
      <input className="search" placeholder="Search users" />
    </div>
    <div className="card table">
      <div className="table-head">
        <span>User</span>
        <span>Type</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {users.map((user) => (
        <div className="table-row" key={user.name}>
          <span>{user.name}</span>
          <span>{user.type}</span>
          <span className={`pill tiny ${user.status === 'Active' ? 'success' : 'warning'}`}>{user.status}</span>
          <span>
            <button className="link tiny">View</button>
            <button className="link tiny warning">Ban</button>
          </span>
        </div>
      ))}
    </div>
  </DashboardLayout>
)

