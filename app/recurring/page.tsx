import { AppShell } from '@/components/layout/AppShell'
import { RecurringForm } from '@/components/recurring/RecurringForm'
import { RecurringToggle } from '@/components/recurring/RecurringToggle'
import { RecurringDelete } from '@/components/recurring/RecurringDelete'
import { prisma } from '@/lib/db'
import { formatCurrency, formatDate, FREQUENCY_LABELS } from '@/lib/utils'
import { RefreshCw, AlertCircle } from 'lucide-react'

export default async function RecurringPage() {
  const [recurring, categories, accounts] = await Promise.all([
    prisma.recurringTransaction.findMany({ include: { category: true }, orderBy: { nextDue: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.account.findMany({ orderBy: { name: 'asc' } }),
  ])

  const active = recurring.filter(r => r.active)
  const totalMonthly = active.filter(r => r.frequency === 'MONTHLY').reduce((s, r) => s + r.amount, 0)
  const now = new Date()
  const overdue = recurring.filter(r => r.active && new Date(r.nextDue) < now)

  return (
    <AppShell title="Recorrentes" subtitle="Pagamentos fixos e assinaturas"
      action={<RecurringForm categories={categories} accounts={accounts} />}>

      {recurring.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Mensal</p>
            <p className="text-sm font-semibold expense-text tabular-nums">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Anual</p>
            <p className="text-sm font-semibold expense-text tabular-nums">{formatCurrency(totalMonthly * 12)}</p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Ativos</p>
            <p className="text-sm font-semibold text-foreground">{active.length}/{recurring.length}</p>
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-xs">
            <span className="font-semibold">{overdue.map(r => r.name).join(', ')}</span> em atraso
          </p>
        </div>
      )}

      {recurring.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <RefreshCw className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-base text-foreground mb-1">Nenhum recorrente</p>
          <p className="text-sm text-muted-foreground">Adicione Netflix, aluguel, internet...</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden space-y-0">
          {recurring.map(r => {
            const isOverdue = r.active && new Date(r.nextDue) < now
            return (
              <div key={r.id} className="flex items-center gap-3 px-4 py-4 border-b border-border/50 last:border-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: r.category.color + '20', color: r.category.color }}>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${r.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                    {r.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium" style={{ color: r.category.color }}>
                      {FREQUENCY_LABELS[r.frequency]}
                    </span>
                    <span className={`text-[10px] ${isOverdue ? 'text-red-400 font-semibold' : 'text-muted-foreground'}`}>
                      {isOverdue ? '⚠️' : '📅'} {formatDate(r.nextDue)}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold expense-text tabular-nums shrink-0 mr-1">
                  {formatCurrency(r.amount)}
                </p>
                <RecurringToggle id={r.id} active={r.active} />
                <RecurringDelete id={r.id} />
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
