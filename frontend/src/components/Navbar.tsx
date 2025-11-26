import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './common/Button'
import { Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'For Influencers', href: '#influencers' },
  { label: 'For Brands', href: '#brands' },
  { label: 'Blog', href: '#blog' },
]

export const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-cream/95 shadow-card backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-charcoal">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal text-ivory shadow-card">
            ✦
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-wide">INFLUENZA</span>
            <span className="text-xs uppercase tracking-[0.3em] text-olive/70">
              Influencer Studio
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-charcoal/70 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-olive"
              onClick={(event) => {
                if (link.href.startsWith('#')) {
                  event.preventDefault()
                  const target = document.querySelector(link.href)
                  target?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" variant="primary" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-charcoal/10 text-charcoal lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-6 mt-2 rounded-3xl border border-charcoal/10 bg-white/90 p-6 shadow-card backdrop-blur">
          <nav className="flex flex-col gap-3 text-base text-charcoal/80">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-2 hover:bg-cream/70"
                onClick={(event) => {
                  if (link.href.startsWith('#')) {
                    event.preventDefault()
                    const target = document.querySelector(link.href)
                    target?.scrollIntoView({ behavior: 'smooth' })
                    setIsMenuOpen(false)
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="ghost" fullWidth asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button fullWidth asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

