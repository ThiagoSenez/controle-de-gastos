'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, PieChart, Settings, TrendingUp, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações',  icon: ArrowLeftRight },
  { href: '/accounts',     label: 'Contas',      icon: Wallet },
  { href: '/budgets',      label: 'Orçamento',   icon: PieChart },
  { href: '/goals',        label: 'Metas',       icon: Target },
  { href: '/recurring',   label: 'Recorrentes', icon: RefreshCw },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col border-r border-border z-40"
      style={{ width: 'var(--sidebar-width)', background: 'hsl(220, 14%, 6%)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[65px] border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <TrendingUp className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-serif text-base text-foreground leading-none">FinanceOS</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Gestão Pessoal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-3 mb-3">Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 relative',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]')}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />}
              <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 shrink-0 border-t border-border pt-3">
        <Link href="/settings"
          className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all',
            pathname === '/settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]')}>
          <Settings className="w-4 h-4 shrink-0" />
          Configurações
        </Link>
        <div className="mt-3 px-3 py-2.5 rounded-xl glass flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary">EU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Minha Conta</p>
            <p className="text-[10px] text-muted-foreground">Pessoal · EUR</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
// Desktop sidebar unchanged — file already exists above
