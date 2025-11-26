import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

const followerData = [
  { month: 'Jan', followers: 12000 },
  { month: 'Feb', followers: 14000 },
  { month: 'Mar', followers: 15500 },
  { month: 'Apr', followers: 17100 },
  { month: 'May', followers: 19000 },
  { month: 'Jun', followers: 21000 },
]

const engagementData = [
  { channel: 'Reels', rate: 4.2 },
  { channel: 'Stories', rate: 5.8 },
  { channel: 'Shorts', rate: 3.9 },
  { channel: 'TikTok', rate: 6.3 },
]

const overviewCards = [
  { label: 'Profile completion', value: '86%', meta: 'Finish media kit' },
  { label: 'Earnings (30d)', value: '$14.8K', meta: '+18% vs last month' },
  { label: 'Active campaigns', value: '6', meta: '2 awaiting approval' },
  { label: 'Application win rate', value: '32%', meta: '+6% this quarter' },
]

const portfolioItems = [
  {
    id: 1,
    title: 'Glow launch reel',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 2,
    title: 'Hybrid athlete story',
    platform: 'TikTok',
    image:
      'https://images.unsplash.com/photo-1450297166380-cabe503887e9?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 3,
    title: 'Vista travel vlog',
    platform: 'YouTube',
    image:
      'https://images.unsplash.com/photo-1445053023192-8d45cb66099d?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 4,
    title: 'StrideX motion',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60',
  },
]

const deadlines = [
  { title: 'Nova Glow launch reel', due: 'Jun 22', budget: '$12k' },
  { title: 'Vista resorts vlog', due: 'Jun 25', budget: '$8k' },
  { title: 'StrideX story set', due: 'Jun 29', budget: '$5k' },
]

const aiTips = [
  'Your travel reels average 6.1% engagement (top 8% creators in this niche).',
  'Brands responding fastest to you: Lumen Glow, Vista Resorts, StrideX.',
  'Post BTS content on Wednesdays 9am PT to lift reach by 18%.',
]

const recommendedCampaigns = [
  { brand: 'Paragon Hotels', title: 'Sunset Sail Series', budget: '$18k', tags: ['Travel', 'Luxury'] },
  { brand: 'Form Athletics', title: 'Hybrid Athlete Diary', budget: '$9k', tags: ['Fitness', 'Wellness'] },
  { brand: 'Amora Beauty', title: 'Glass Skin Ritual', budget: '$12k', tags: ['Beauty', 'Organic'] },
]

const sidebarItems = [
  { label: 'Dashboard', href: '/influencer/dashboard' },
  { label: 'My Profile', href: '/influencer/profile' },
  { label: 'Portfolio', href: '/influencer/portfolio' },
  { label: 'Browse Campaigns', href: '/influencer/campaigns' },
  { label: 'Messaging', href: '/influencer/messaging' },
  { label: 'Earnings', href: '/influencer/earnings' },
]

export const InfluencerDashboard = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout
      title="Influencer HQ"
      subtitle="Quick pulse across your channels, briefs, and earnings."
      sidebarItems={sidebarItems}
      actionSlot={
        <Button variant="secondary" onClick={() => navigate('/influencer/portfolio')}>
          Share media kit
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal/40">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-charcoal">{card.value}</p>
            <p className="text-sm text-sage">{card.meta}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-charcoal/40">Growth</p>
              <h3 className="font-display text-2xl text-charcoal">Follower velocity</h3>
            </div>
            <Badge tone="sage">Live</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerData}>
                <CartesianGrid strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="month" />
                <Tooltip />
                <Line type="monotone" dataKey="followers" stroke="#6B8573" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal/40">Content performance</p>
          <h3 className="font-display text-2xl text-charcoal">Engagement by channel</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="channel" />
                <Tooltip />
                <Bar dataKey="rate" fill="#2D2D2D" radius={[16, 16, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-charcoal">Recommended for you</h3>
            <Button variant="ghost" onClick={() => navigate('/influencer/campaigns')}>
              View all
            </Button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {recommendedCampaigns.map((campaign) => (
              <div
                key={campaign.title}
                className="rounded-[24px] border border-charcoal/10 p-4 transition hover:-translate-y-1 hover:border-sage/60"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal/40">{campaign.brand}</p>
                <h4 className="mt-2 font-semibold text-charcoal">{campaign.title}</h4>
                <p className="text-sm text-sage">{campaign.budget}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <Badge key={tag} tone="cream">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/influencer/campaigns/apply')}
                >
                  View details
                </Button>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl text-charcoal">Deadlines</h3>
            <Badge tone="blush">3 soon</Badge>
          </div>
          <ul className="space-y-3">
            {deadlines.map((deadline) => (
              <li
                key={deadline.title}
                className="flex items-center justify-between rounded-2xl border border-charcoal/10 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-charcoal">{deadline.title}</p>
                  <p className="text-xs text-charcoal/50">{deadline.due}</p>
                </div>
                <Button size="sm" variant="ghost">
                  {deadline.budget}
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="secondary" fullWidth onClick={() => navigate('/influencer/earnings')}>
            View payouts
          </Button>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-charcoal">Portfolio highlight</h3>
            <Button variant="ghost" onClick={() => navigate('/influencer/portfolio')}>
              Manage
            </Button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {portfolioItems.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-[24px] border border-white/60 bg-white/70">
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-charcoal/40">{item.platform}</p>
                  <h4 className="font-semibold text-charcoal">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-white/70 bg-charcoal text-white shadow-card">
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">AI insights</p>
            <h3 className="mt-2 font-display text-2xl">Lumi’s recommendations</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {aiTips.map((tip) => (
                <li key={tip} className="rounded-2xl bg-white/10 p-3">
                  {tip}
                </li>
              ))}
            </ul>
            <Button className="mt-5 w-full" variant="outline" onClick={() => navigate('/ai')}>
              Ask the AI copilot
            </Button>
          </div>
        </article>
      </section>
    </DashboardLayout>
  )
}
