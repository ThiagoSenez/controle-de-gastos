import { AppShell } from '@/components/layout/AppShell'
import { GoalForm } from '@/components/goals/GoalForm'
import { GoalDepositForm } from '@/components/goals/GoalDepositForm'
import { prisma } from '@/lib/db'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Target, Calendar, CheckCircle2, Trophy } from 'lucide-react'

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'desc' } })
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0)
  const completed = goals.filter(g => g.currentAmount >= g.targetAmount).length

  return (
    <AppShell title="Metas" subtitle="Os seus objetivos financeiros" action={<GoalForm />}>
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Total</p>
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatCurrency(totalTarget)}</p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Guardado</p>
            <p className="text-sm font-semibold income-text tabular-nums">{formatCurrency(totalSaved)}</p>
          </div>
          <div className="glass-card rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Completas</p>
            <p className="text-sm font-semibold text-foreground">{completed}/{goals.length}</p>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-base text-foreground mb-1">Nenhuma meta</p>
          <p className="text-sm text-muted-foreground">Crie a sua primeira meta financeira</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100)
            const isDone = g.currentAmount >= g.targetAmount
            return (
              <div key={g.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: g.color + '20', color: g.color }}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{g.name}</p>
                      {g.targetDate && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground">{formatDate(g.targetDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {isDone && <span className="text-[10px] income-badge px-2 py-0.5 rounded-full font-medium">✓ Feita</span>}
                </div>

                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-foreground tabular-nums">{formatCurrency(g.currentAmount)}</span>
                  <span className="text-muted-foreground tabular-nums">{formatCurrency(g.targetAmount)}</span>
                </div>

                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: isDone ? '#34D399' : g.color }} />
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-muted-foreground">
                    {isDone ? '🎉 Concluída!' : `Faltam ${formatCurrency(g.targetAmount - g.currentAmount)}`}
                  </p>
                  <p className="text-[10px] font-bold tabular-nums" style={{ color: isDone ? '#34D399' : g.color }}>
                    {pct.toFixed(0)}%
                  </p>
                </div>

                <GoalDepositForm goalId={g.id} goalName={g.name}
                  currentAmount={g.currentAmount} targetAmount={g.targetAmount} color={g.color} />
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
