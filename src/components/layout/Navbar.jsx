import { NavLink } from 'react-router-dom'
import { Cpu, History, BarChart3, ShieldCheck } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

const links = [
  { to: '/', label: 'Dashboard', icon: Cpu },
  { to: '/history', label: 'History', icon: History },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-color glass-effect backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pass rounded-full border-2 border-bg-card animate-pulse"></div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-text-primary uppercase">
              AuthentiChip
            </p>
            <p className="text-sm font-medium text-text-secondary">IC Counterfeit Detection</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {links.map(({ to, label, icon: Icon, comingSoon }) => (
            <NavLink
              key={to}
              to={comingSoon ? '#' : to}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold',
                  isActive && !comingSoon
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary',
                  comingSoon && 'opacity-50 cursor-not-allowed',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {comingSoon && (
                <span className="ml-1 text-[10px] uppercase tracking-wide text-text-muted bg-bg-panel px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
          <div className="ml-4 pl-4 border-l border-border-color">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}


