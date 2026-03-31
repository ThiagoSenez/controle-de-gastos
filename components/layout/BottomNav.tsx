'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard',    label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/accounts',     label: 'Contas',     icon: Wallet },
  { href: '/budgets',      label: 'Orçamento',  icon: PieChart },
  { href: '/goals',        label: 'Metas',      icon: Target },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: 'hsl(220, 14%, 6%)', borderTop: '1px solid hsl(220, 12%, 13%)' }}>
      <div className="flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150 active:scale-95',
                active ? 'text-primary' : 'text-muted-foreground'
              )}>
              <div className={cn('relative flex items-center justify-center w-8 h-8 rounded-xl transition-all',
                active && 'bg-primary/10')}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 1.75} />
                {active && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />}
              </div>
              <span className={cn('text-[10px] font-medium leading-none', active ? 'text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
