import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DashboardLayout } from '../../components/DashboardLayout'
import { StatCard } from '../../components/StatCard'
import { Button } from '../../components/common/Button'

const sidebarItems = [
  { label: 'Dashboard', href: '/brand/dashboard' },
  { label: 'Create Campaign', href: '/brand/create-campaign' },
  { label: 'Manage Campaigns', href: '/brand/manage-campaigns' },
  { label: 'Browse Influencers', href: '/brand/browse-influencers' },
  { label: 'Messaging', href: '/brand/messaging' },
  { label: 'Payments', href: '/brand/payments' },
]

const performanceData = [
  { week: 'W1', impressions: 120000 },
  { week: 'W2', impressions: 149000 },
  { week: 'W3', impressions: 172000 },
  { week: 'W4', impressions: 210000 },
]

const budgetData = [
  { name: 'Creators', value: 45 },
  { name: 'Paid media', value: 25 },
  { name: 'Production', value: 20 },
  { name: 'Shipping', value: 10 },
]

const COLORS = ['#6B8573', '#D4A5A5', '#2D2D2D', '#E8DFD0']

export const BrandDashboard = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout
      title="Brand control center"
      subtitle="Monitor campaign health, spend, and invites."
      sidebarItems={sidebarItems}
      actionSlot={
        <Button onClick={() => navigate('/brand/create-campaign')} variant="primary">
          New campaign
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total campaigns" value="32" trend="+4 vs last quarter" />
        <StatCard label="Active campaigns" value="8" badge="3 launching" />
        <StatCard label="Amount spent" value="$214K" variant="accent" />
        <StatCard label="Influencer invites" value="54" trend="12 pending" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-charcoal">Campaign performance</h3>
            <Button variant="ghost">Last 4 weeks</Button>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="week" />
                <Tooltip />
                <Line type="monotone" dataKey="impressions" stroke="#6B8573" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-charcoal">Budget allocation</h3>
            <Button variant="ghost">FY 2025</Button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="h-60 w-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetData} outerRadius={110} dataKey="value">
                    {budgetData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-sm text-charcoal/70">
              {budgetData.map((entry, index) => (
                <li key={entry.name} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {entry.name} · {entry.value}%
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </DashboardLayout>
  )
}
