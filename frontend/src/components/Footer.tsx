import { Link } from 'react-router-dom'
import { Mail, Instagram, Youtube, Linkedin } from 'lucide-react'
import { Button } from './common/Button'

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Campaign OS', href: '/brand/manage-campaigns' },
      { label: 'AI Assistant', href: '/ai' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Support', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
]

export const Footer = () => (
  <footer className="mt-32 bg-charcoal/95 text-cream">
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_2fr]">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cream/60">LumiCollab</p>
          <h3 className="font-display text-3xl leading-snug text-white">
            Where premium brands meet iconic creators.
          </h3>
          <p className="mt-4 text-sm text-cream/70">
            Curated campaigns, concierge support, and AI copilots to keep every collaboration effortless.
          </p>
        </div>
        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-cream/70">
            <Mail size={18} />
            success@lumicollab.studio
          </div>
          <div className="flex items-center gap-3 text-sm text-cream/70">
            HQ: 11 Mercer Street, New York, NY
          </div>
        </div>
        <div className="flex gap-3 text-charcoal">
          {[Instagram, Youtube, Linkedin].map((Icon) => (
            <a
              key={Icon.name}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white hover:text-charcoal"
              href="https://lumicollab.studio"
              aria-label={Icon.name}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/60">{column.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-cream/70 transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} LumiCollab · Crafted for modern creator economies.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="text-xs text-white" asChild>
            <Link to="/newsletter">Join the newsletter</Link>
          </Button>
          <a href="/status" className="text-xs hover:text-white">
            Status
          </a>
          <a href="/legal" className="text-xs hover:text-white">
            Legal
          </a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
