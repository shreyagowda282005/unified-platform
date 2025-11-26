import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { GlassCard } from '../components/common/GlassCard'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import {
  Sparkles,
  Search,
  Star,
  BarChart3,
  DollarSign,
  Megaphone,
  CheckCircle2,
  Repeat,
  Handshake,
} from 'lucide-react'
import { useMemo } from 'react'

const heroCards = [
  {
    name: 'Maya Ellis',
    handle: '@maya.studio',
    niche: 'Design & Lifestyle',
    stat: '6.3% engagement',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    accent: 'bg-sage/20 text-sage',
  },
  {
    name: 'Atlas Fit',
    handle: '@atlas.fit',
    niche: 'Wellness',
    stat: '$78k earned',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
    accent: 'bg-blush/20 text-blush',
  },
  {
    name: 'Nova Stories',
    handle: '@novastories',
    niche: 'Travel & Cinematic',
    stat: '4 campaigns live',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    accent: 'bg-charcoal/90 text-cream',
  },
]

const partnerLogos = ['Meta', 'Peloton', 'Supreme', 'The North Face', 'Prada', 'Chanel', 'Pandora', 'Target']

const featureCards = [
  {
    title: 'Smart Matching Algorithm',
    description: 'AI curates high-fit creators for every brief, factoring tone, audience, and past ROI.',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=900&q=80',
    size: 'large',
  },
  {
    title: 'Real-Time Analytics',
    description: 'Campaign dashboards refresh every minute so teams can react instantly.',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    size: 'medium',
  },
  {
    title: 'Secure Payments',
    description: 'Escrow, instant payouts, and compliance-ready invoicing built in.',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=600&q=80',
    size: 'medium',
  },
  {
    title: 'Campaign Management',
    description: 'Track every deliverable—from pitch to post—with concierge alerts.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    size: 'large',
  },
  {
    title: 'Chat & Collaborate',
    description: 'Threaded briefs, media approvals, and AI composing assistance.',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
    size: 'small',
  },
  {
    title: 'Portfolio Showcase',
    description: 'Live media walls and case studies to close big brand deals.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    size: 'small',
  },
]

const influencerTimeline = [
  { step: 'Create Your Profile', description: 'Polished portfolio, rates, and niche badges.', icon: Sparkles },
  { step: 'Browse Campaigns', description: 'Filter by brief, budget, platform, or vibe.', icon: Search },
  { step: 'Collaborate Seamlessly', description: 'Chat, share drafts, and keep approvals in sync.', icon: Handshake },
  { step: 'Get Paid Instantly', description: 'Escrow-backed payouts land 24h after approval.', icon: DollarSign },
]

const brandTimeline = [
  { step: 'Post Your Campaign', description: 'Guided brief builder with AI recommendations.', icon: Megaphone },
  { step: 'Review Applications', description: 'Stack-ranked matches with media kits and predicted ROI.', icon: CheckCircle2 },
  { step: 'Measure Success', description: 'Unified analytics on reach, engagement, and conversion.', icon: BarChart3 },
  { step: 'Scale What Works', description: 'Duplicate top campaigns or invite proven creators in a click.', icon: Repeat },
]

const testimonials = [
  {
    quote: 'We wrapped a 42-creator launch in 18 days. Lumi automated payouts and tracking—it felt like cheating.',
    name: 'Sofia Moreno',
    title: 'Head of Social · Prada Beauty',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
  },
  {
    quote: 'The AI assistant rewrote my pitches and landed me three luxury campaigns in a week.',
    name: 'Cam Lawson',
    title: 'Lifestyle Creator · 780K audience',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    quote: 'We watch performance in real time, tweak deliverables, and unlock new budgets mid-flight.',
    name: 'Lena Ortiz',
    title: 'Global Influencer Lead · Peloton',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
]

const statHighlights = [
  { label: 'Active Creators', value: '10,000+', suffix: '', description: 'Hand-vetted talent worldwide' },
  { label: 'Campaigns Completed', value: '5,000+', suffix: '', description: 'Every industry, every format' },
  { label: 'Earned by Creators', value: '$2M+', suffix: '', description: 'Fast payouts, zero surprises' },
  { label: 'Average Rating', value: '4.9', suffix: '★', description: 'Creators & brands worldwide' },
]

export const LandingPage = () => {
  const heroBadges = useMemo(
    () => [
      { label: '10K+ Creators', pos: 'top-10 left-4' },
      { label: '500+ Brands', pos: 'bottom-16 right-6' },
      { label: '$2M+ Earned', pos: 'top-1/2 -translate-y-1/2 right-0' },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-cream/40">
      <Navbar />
      <main className="pt-32">
        <section className="relative overflow-hidden px-6 pb-24 pt-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
            <div className="flex-1 space-y-6">
              <Badge tone="sage">Boutique Influencer OS</Badge>
              <h1 className="font-display text-5xl leading-tight tracking-tight text-charcoal md:text-6xl">
                Connect brands with creators.<br />Amplify every collaboration.
              </h1>
              <p className="text-lg text-charcoal/80 md:w-4/5">
                LumiCollab is the all-in-one platform for premium influencers and brands. Brief, book, chat, approve,
                and get paid—with AI copilots smoothing every detail.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup?role=influencer">Join as Influencer</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/signup?role=brand">I'm a Brand</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <div>
                  <p className="text-3xl font-semibold text-charcoal">48h</p>
                  <p className="text-sm text-charcoal/70">Average time to hire</p>
                </div>
                <div className="h-10 w-px bg-charcoal/20" />
                <div>
                  <p className="text-3xl font-semibold text-charcoal">99.4%</p>
                  <p className="text-sm text-charcoal/70">On-time deliverables</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-1 justify-center">
              <div className="absolute inset-0 rounded-[40px] bg-hero-gradient blur-3xl" />
              <div className="relative grid gap-6">
                {heroCards.map((card, index) => (
                  <motion.div
                    key={card.name}
                    className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-glass backdrop-blur-xl"
                    style={{ rotate: index === 1 ? -3 : index === 2 ? 5 : -1 }}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-16 w-16 rounded-3xl object-cover shadow-card"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">{card.name}</p>
                        <p className="text-sm text-charcoal/60">{card.handle}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-sm">
                      <span className={`rounded-full px-3 py-1 ${card.accent}`}>{card.niche}</span>
                      <span className="font-semibold text-charcoal/80">{card.stat}</span>
                    </div>
                  </motion.div>
                ))}

                {heroBadges.map((badge) => (
                  <motion.div
                    key={badge.label}
                    className={`absolute ${badge.pos} rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-sm font-semibold text-charcoal shadow-card backdrop-blur`}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: Math.random() * 2 }}
                  >
                    {badge.label}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/80 py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 text-sm uppercase tracking-[0.5em] text-charcoal/30">
            {partnerLogos.map((logo) => (
              <span key={logo} className="transition hover:text-olive">
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge tone="blush">Everything you need</Badge>
                <h2 className="mt-4 font-display text-4xl text-charcoal">From discovery to payout, curated to feel bespoke.</h2>
                <p className="mt-3 text-charcoal/70">
                  Modular bento layouts combine dashboards, chat, payments, and analytics with glassmorphic polish.
                </p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/login">Explore the workspace</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-6">
              {featureCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className={`relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-card backdrop-blur-xl ${
                    card.size === 'large'
                      ? 'md:col-span-3'
                      : card.size === 'medium'
                      ? 'md:col-span-2'
                      : 'md:col-span-1'
                  }`}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img src={card.image} alt={card.title} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-charcoal">{card.title}</h3>
                    <p className="mt-2 text-sm text-charcoal/70">{card.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-cream/80 px-6 py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <Badge tone="charcoal">How it works</Badge>
              <h2 className="mt-4 font-display text-4xl text-charcoal">Purpose-built flows for both sides of the marketplace.</h2>
              <p className="mt-3 text-charcoal/70">Parallel timelines keep influencers and brands perfectly in sync.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[{ title: 'For Influencers', steps: influencerTimeline }, { title: 'For Brands', steps: brandTimeline }].map(
                (group) => (
                  <GlassCard key={group.title} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl text-charcoal">{group.title}</h3>
                      <Badge tone="cream">4 Steps</Badge>
                    </div>
                    <div className="space-y-6">
                      {group.steps.map((step) => (
                        <div key={step.step} className="flex gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage">
                            <step.icon size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal">{step.step}</p>
                            <p className="text-sm text-charcoal/70">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )
              )}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge tone="sage">Loved globally</Badge>
                <h2 className="mt-4 font-display text-4xl text-charcoal">Trusted by creators & brands worldwide.</h2>
                <p className="mt-3 text-charcoal/70">Concierge onboarding, AI copilots, and human insight keeps everyone delighted.</p>
              </div>
              <div className="text-right text-sm text-charcoal/60">
                4.9/5 · 1,200+ verified reviews
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <GlassCard key={testimonial.name} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-charcoal">{testimonial.name}</p>
                      <p className="text-sm text-charcoal/60">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal/80">“{testimonial.quote}”</p>
                  <div className="flex gap-1 text-blush">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={16} fill="#D4A5A5" stroke="none" />
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-sage py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-4">
              {statHighlights.map((stat) => (
                <div key={stat.label} className="rounded-[28px] bg-white/10 p-6 text-center shadow-glass backdrop-blur">
                  <p className="text-4xl font-semibold">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">{stat.label}</p>
                  <p className="mt-3 text-sm text-white/80">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 rounded-[40px] bg-cta-gradient px-8 py-16 text-white lg:grid-cols-2">
            <div className="space-y-6">
              <Badge tone="cream">Ready when you are</Badge>
              <h2 className="font-display text-4xl">Ready to get started?</h2>
              <p className="text-white/80">
                Influencers unlock AI profile audits, smart applications, and instant payouts. Brands orchestrate multi-channel briefs and see ROI in real-time.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <GlassCard className="bg-white/10 text-white">
                  <h3 className="font-display text-2xl">For Influencers</h3>
                  <p className="mt-2 text-sm text-white/70">Smart profile scoring, AI pitches, lightning payouts.</p>
                  <Button className="mt-4 w-full" variant="outline" asChild>
                    <Link to="/signup?role=influencer">Apply now</Link>
                  </Button>
                </GlassCard>
                <GlassCard className="bg-white/10 text-white">
                  <h3 className="font-display text-2xl">For Brands</h3>
                  <p className="mt-2 text-sm text-white/70">Concierge brief setup, verified creators, ROI analytics.</p>
                  <Button className="mt-4 w-full" variant="outline" asChild>
                    <Link to="/signup?role=brand">Book a demo</Link>
                  </Button>
                </GlassCard>
              </div>
            </div>
            <div className="space-y-6 text-sm text-white/80">
              <p>Included across every plan:</p>
              <ul className="space-y-3">
                {['AI campaign assistant', 'Glass dashboard with real-time analytics', 'Secure escrow & instant payouts', 'Radix-powered modals and deep search'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/15">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
