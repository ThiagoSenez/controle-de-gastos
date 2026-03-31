import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function AppShell({ children, title, subtitle, action, className }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-[var(--sidebar-width)] min-w-0">
        {/* Header — with safe area top padding on mobile */}
        <header className="shrink-0 border-b border-border bg-background/90 backdrop-blur-xl z-30"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-5 md:px-8 h-[60px] md:h-[65px]">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-[1.1rem] md:text-xl text-foreground leading-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate hidden md:block">{subtitle}</p>
              )}
            </div>
            {action && <div className="ml-3 shrink-0">{action}</div>}
          </div>
        </header>

        {/* Scrollable page content */}
        <main className={cn('flex-1 overflow-y-auto -webkit-overflow-scrolling-touch', className)}
          style={{
            paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom) + 16px)',
          }}>
          <div className="p-5 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
