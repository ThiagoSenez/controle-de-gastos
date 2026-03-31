import { AppShell } from '@/components/layout/AppShell'
import { BudgetForm } from '@/components/budgets/BudgetForm'
import { prisma } from '@/lib/db'
import { formatCurrency, capitalize } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, PieChart } from 'lucide-react'

export default async function BudgetsPage() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59)

  const [budgets, categories, spent] = await Promise.all([
    prisma.budget.findMany({ where: { month, year }, include: { category: true } }),
    prisma.category.findMany({ where: { type: 'EXPENSE' }, orderBy: { name: 'asc' } }),
    prisma.transaction.groupBy({ by: ['categoryId'], where: { type: 'EXPENSE', date: { gte: start, lte: end } }, _sum: { amount: true } }),
  ])

  const data = budgets.map(b => ({ ...b, spent: spent.find(s => s.categoryId === b.categoryId)?._sum.amount ?? 0 }))
  const totalLimit = data.reduce((s, b) => s + b.limit, 0)
  const totalSpent = data.reduce((s, b) => s + b.spent, 0)
  const overBudget = data.filter(b => b.spent > b.limit)
  const monthLabel = capitalize(format(now, 'MMMM yyyy', { locale: ptBR }))

  return (
    <AppShell title="Orçamento" subtitle={monthLabel}
      action={<BudgetForm categories={categories} month={month} year={year} />}>

      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Orçado</p>
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatCurrency(totalLimit)}</p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Gasto</p>
            <p className={`text-sm font-semibold tabular-nums ${totalSpent > totalLimit ? 'expense-text' : 'income-text'}`}>
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Restante</p>
            <p className={`text-sm font-semibold tabular-nums ${totalLimit - totalSpent >= 0 ? 'income-text' : 'expense-text'}`}>
              {formatCurrency(Math.max(totalLimit - totalSpent, 0))}
            </p>
          </div>
        </div>
      )}

      {overBudget.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-xs">
            <span className="font-semibold">{overBudget.map(b => b.category.name).join(', ')}</span> ultrapassou o limite
          </p>
        </div>
      )}

      {data.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <PieChart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-base text-foreground mb-1">Sem orçamentos</p>
          <p className="text-sm text-muted-foreground">Defina limites por categoria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(b => {
            const pct = Math.min((b.spent / b.limit) * 100, 100)
            const isOver = b.spent > b.limit
            const isWarn = pct >= 80 && !isOver
            return (
              <div key={b.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: b.category.color + '20', color: b.category.color }}>
                      {b.category.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.category.name}</p>
                      <p className="text-[10px] text-muted-foreground">{pct.toFixed(0)}% utilizado</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${isOver ? 'expense-text' : 'text-foreground'}`}>
                      {formatCurrency(b.spent)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">/ {formatCurrency(b.limit)}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: isOver ? '#F87171' : isWarn ? '#FBBF24' : b.category.color }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {isOver ? `⚠️ Excedeu ${formatCurrency(b.spent - b.limit)}` : `Restam ${formatCurrency(b.limit - b.spent)}`}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
