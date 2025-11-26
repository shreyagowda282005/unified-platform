import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, MessageCircle, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { Button } from './common/Button'
import { Badge } from './common/Badge'
import { cn } from '../utils/cn'

type SidebarItem = {
  label: string
  href: string
}

interface DashboardLayoutProps {
  title: string
  subtitle?: string
  sidebarItems: SidebarItem[]
  actionSlot?: ReactNode
  children: ReactNode
}

export const DashboardLayout = ({
  title,
  subtitle,
  sidebarItems,
  actionSlot,
  children,
}: DashboardLayoutProps) => {
  const location = useLocation()
  const { unreadMessages } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderSidebar = () => (
    <aside className="flex h-full flex-col gap-8 bg-white/90 px-6 py-8 shadow-card backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal/30">LumiCollab</p>
        <h2 className="font-display text-2xl text-charcoal">Control Room</h2>
        <p className="text-xs text-charcoal/50">Curated for you</p>
      </div>

      <div className="rounded-[26px] bg-cream/70 p-4">
        <p className="text-sm text-charcoal/60">Pulse score</p>
        <p className="text-3xl font-semibold text-charcoal">92</p>
        <p className="text-xs text-sage">+6 this week</p>
      </div>

      <nav className="space-y-1 text-sm">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center justify-between rounded-2xl px-4 py-3 transition',
                isActive ? 'bg-sage/15 text-sage' : 'text-charcoal/60 hover:bg-charcoal/5'
              )}
            >
              <span>{item.label}</span>
              {item.label.toLowerCase().includes('mess') && unreadMessages > 0 && (
                <Badge tone="blush">{unreadMessages}</Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <div className="min-h-screen bg-cream/30">
      <div className="flex">
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 -translate-x-full transform transition duration-300 md:translate-x-0',
            sidebarOpen && 'translate-x-0'
          )}
        >
          {renderSidebar()}
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 md:pl-72">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/50 bg-white/80 px-6 py-4 backdrop-blur">
            <button
              className="rounded-2xl border border-charcoal/10 p-2 text-charcoal md:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu size={18} />
            </button>
            <div className="flex flex-1 items-center gap-3 rounded-3xl border border-charcoal/10 bg-white px-4 py-2">
              <Search size={18} className="text-charcoal/40" />
              <input
                placeholder="Search campaigns, creators, briefs..."
                className="w-full bg-transparent text-sm outline-none"
              />
              <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-xs text-charcoal/60">⌘K</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-2xl border border-charcoal/10 p-2">
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blush" />
              </button>
              <button className="relative rounded-2xl border border-charcoal/10 p-2">
                <MessageCircle size={18} />
                {unreadMessages > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-blush px-1 text-[10px] text-white">
                    {unreadMessages}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2 rounded-2xl border border-charcoal/10 px-3 py-1.5">
                <div className="h-8 w-8 rounded-2xl bg-sage/30" />
                <div>
                  <p className="text-xs font-semibold text-charcoal">You</p>
                  <p className="text-[11px] text-charcoal/50">Premium tier</p>
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 py-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-charcoal/40">Workspace</p>
                <h1 className="font-display text-4xl text-charcoal">{title}</h1>
                {subtitle && <p className="text-sm text-charcoal/60">{subtitle}</p>}
              </div>
              {actionSlot ?? <Button variant="secondary">Add new</Button>}
            </div>

            <section className="mt-10">{children}</section>
          </main>
        </div>
      </div>
    </div>
  )
}

