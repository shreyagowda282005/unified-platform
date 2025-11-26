import { DashboardLayout } from '../../components/DashboardLayout'
import { StatCard } from '../../components/StatCard'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

const payouts = [
  { ref: '#P-1204', brand: 'Nova Glow', influencer: 'Ayla Rivers', amount: '$4,200', status: 'Released' },
  { ref: '#P-1205', brand: 'Vista', influencer: 'Leo Miles', amount: '$9,400', status: 'On hold' },
]

export const AdminPayments = () => (
  <DashboardLayout
    title="Payments oversight"
    subtitle="Monitor payouts, holds, and disputes"
    sidebarItems={sidebarItems}
  >
    <div className="grid stats">
      <StatCard label="Payments today" value="$48K" />
      <StatCard label="On hold" value="$6.2K" variant="accent" />
      <StatCard label="Disputes" value="2" />
    </div>
    <div className="card table">
      <div className="table-head">
        <span>Ref</span>
        <span>Brand</span>
        <span>Influencer</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      {payouts.map((payout) => (
        <div className="table-row" key={payout.ref}>
          <span>{payout.ref}</span>
          <span>{payout.brand}</span>
          <span>{payout.influencer}</span>
          <span>{payout.amount}</span>
          <span className={`pill tiny ${payout.status === 'Released' ? 'success' : 'warning'}`}>
            {payout.status}
          </span>
        </div>
      ))}
    </div>
  </DashboardLayout>
)

