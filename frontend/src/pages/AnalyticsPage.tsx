import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { StatCard } from '../components/StatCard'

const followerData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 13400 },
  { month: 'Mar', value: 16000 },
  { month: 'Apr', value: 18800 },
  { month: 'May', value: 21000 },
]

const engagementTrend = [
  { month: 'Jan', rate: 4.2 },
  { month: 'Feb', rate: 4.8 },
  { month: 'Mar', rate: 5.1 },
  { month: 'Apr', rate: 5.5 },
  { month: 'May', rate: 5.9 },
]

const campaignImpressions = [
  { campaign: 'Nova', impressions: 240000 },
  { campaign: 'Vista', impressions: 320000 },
  { campaign: 'StrideX', impressions: 180000 },
  { campaign: 'AeroFit', impressions: 280000 },
]

export const AnalyticsPage = () => (
  <div className="analytics-page">
    <header>
      <h1>Intelligence & analytics</h1>
      <p>Unified metrics for teams across the platform.</p>
    </header>
    <div className="grid stats">
      <StatCard label="Audience growth" value="+42%" variant="accent" />
      <StatCard label="Average engagement" value="5.9%" />
      <StatCard label="Campaign impressions" value="1.2M" />
    </div>
    <div className="grid charts">
      <div className="card chart-card">
        <h3>Follower growth</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={followerData}>
            <CartesianGrid strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="month" />
            <Tooltip />
            <Line dataKey="value" stroke="#FF9F1C" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-card">
        <h3>Engagement trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={engagementTrend}>
            <CartesianGrid strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="month" />
            <Tooltip />
            <Line dataKey="rate" stroke="#FF6A00" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-card span-2">
        <h3>Campaign impressions</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={campaignImpressions}>
            <CartesianGrid strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="campaign" />
            <Tooltip />
            <Bar dataKey="impressions" fill="#FFC938" radius={[16, 16, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
)

