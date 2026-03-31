import { cn, formatCurrency } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  variant?: 'default' | 'income' | 'expense' | 'primary'
}

const variants = {
  default:  { border: 'border-border', iconBg: 'bg-secondary text-muted-foreground' },
  income:   { border: 'border-border hover:border-emerald-500/20', iconBg: 'bg-emerald-500/10 text-emerald-400' },
  expense:  { border: 'border-border hover:border-red-500/20', iconBg: 'bg-red-500/10 text-red-400' },
  primary:  { border: 'border-primary/20 glow-amber', iconBg: 'bg-primary/10 text-primary' },
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const v = variants[variant]
  return (
    <div className={cn('glass-card rounded-2xl p-4 transition-all', v.border)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide leading-tight">{title}</p>
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', v.iconBg)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <p className="text-lg md:text-xl font-semibold text-foreground tabular-nums leading-none tracking-tight">
        {formatCurrency(value)}
      </p>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1.5', trend >= 0 ? 'income-text' : 'expense-text')}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="text-[10px] font-medium">{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
