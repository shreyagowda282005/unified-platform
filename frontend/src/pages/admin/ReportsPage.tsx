import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

export const ReportsPage = () => (
  <DashboardLayout title="Reports" subtitle="Export compliance & payout summaries" sidebarItems={sidebarItems}>
    <div className="card">
      <h3>Generate report</h3>
      <div className="grid two">
        <label>
          Report type
          <select>
            <option>Weekly overview</option>
            <option>Payments</option>
            <option>Fraud signals</option>
          </select>
        </label>
        <label>
          Date range
          <input type="date" />
        </label>
      </div>
      <button className="cta">Export PDF</button>
    </div>
    <div className="card">
      <h3>Recent reports</h3>
      <ul className="list">
        <li>Week 23 performance – exported 2h ago</li>
        <li>Payments recap – exported yesterday</li>
        <li>Flagged accounts – exported 3d ago</li>
      </ul>
    </div>
  </DashboardLayout>
)

