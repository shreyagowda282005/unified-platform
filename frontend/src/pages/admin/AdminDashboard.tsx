import { DashboardLayout } from '../../components/DashboardLayout'
import { StatCard } from '../../components/StatCard'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

export const AdminDashboard = () => (
  <DashboardLayout
    title="Admin overview"
    subtitle="Monitor platform health, compliance, and payments"
    sidebarItems={sidebarItems}
  >
    <div className="grid stats">
      <StatCard label="Total users" value="18,420" />
      <StatCard label="Active campaigns" value="142" />
      <StatCard label="Payments today" value="$48K" variant="accent" />
    </div>
    <div className="card">
      <h3>Alerts</h3>
      <ul className="list">
        <li>3 campaigns pending manual review</li>
        <li>1 payment flagged for verification</li>
        <li>Weekly report ready to export</li>
      </ul>
    </div>
  </DashboardLayout>
)

