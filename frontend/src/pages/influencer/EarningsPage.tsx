import { DashboardLayout } from '../../components/DashboardLayout'
import { StatCard } from '../../components/StatCard'

const sidebarItems = [
  { label: 'Dashboard', href: '/influencer/dashboard' },
  { label: 'My Profile', href: '/influencer/profile' },
  { label: 'Portfolio Uploads', href: '/influencer/portfolio' },
  { label: 'My Applications', href: '/influencer/campaigns' },
  { label: 'Messaging', href: '/influencer/messaging' },
  { label: 'Earnings', href: '/influencer/earnings' },
  { label: 'Settings', href: '/settings' },
]

const transactions = [
  { campaign: 'Nova Glow launch', amount: '$4,200', status: 'Paid', date: 'Jun 02' },
  { campaign: 'Vista Resorts docu', amount: '$9,400', status: 'Pending', date: 'Jun 06' },
  { campaign: 'StrideX stories', amount: '$2,150', status: 'Paid', date: 'May 28' },
]

export const EarningsPage = () => (
  <DashboardLayout
    title="Earnings"
    subtitle="Track cleared, pending, and incoming payouts"
    sidebarItems={sidebarItems}
  >
    <div className="grid stats">
      <StatCard label="Total earned" value="$42,840" trend="+32% YoY" />
      <StatCard label="Pending" value="$4,760" variant="accent" />
      <StatCard label="Average CPM" value="$42" />
    </div>
    <div className="card table">
      <div className="table-head">
        <span>Campaign</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Date</span>
      </div>
      {transactions.map((tx) => (
        <div className="table-row" key={tx.campaign}>
          <span>{tx.campaign}</span>
          <span>{tx.amount}</span>
          <span className={`pill tiny ${tx.status === 'Paid' ? 'success' : 'warning'}`}>{tx.status}</span>
          <span>{tx.date}</span>
        </div>
      ))}
    </div>
  </DashboardLayout>
)

