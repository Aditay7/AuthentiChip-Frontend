import { NavLink } from 'react-router-dom'
import { Cpu, History, BarChart3, FileText } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: Cpu },
  { to: '/history', label: 'History', icon: History },
  { to: '/report', label: 'Reports', icon: FileText },
  // Suggestion for future page; route can be added later
  { to: '/analytics', label: 'Analytics', icon: BarChart3, comingSoon: true },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              AuthentiChip
            </p>
            <p className="text-sm text-slate-800">Optical IC Verification</p>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          {links.map(({ to, label, icon: Icon, comingSoon }) => (
            <NavLink
              key={to}
              to={comingSoon ? '#' : to}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ',
                  isActive && !comingSoon
                    ? ' text-white shadow-xl shadow-black-500/50  text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                  comingSoon && 'opacity-60 cursor-default',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {comingSoon && (
                <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-400">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}


