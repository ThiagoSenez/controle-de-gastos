import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { prisma } from '@/lib/db'
import { formatCurrency, formatDate, getLast6Months } from '@/lib/utils'
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowRight, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

async function getData() {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  const prevStart = startOfMonth(subMonths(now, 1))
  const prevEnd = endOfMonth(subMonths(now, 1))

  const [accounts, categories, currentTxs, prevTxs, catSpending] = await Promise.all([
    prisma.account.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.category.findMany(),
    prisma.transaction.findMany({ where: { date: { gte: start, lte: end } }, include: { category: true, account: true }, orderBy: { date: 'desc' } }),
    prisma.transaction.findMany({ where: { date: { gte: prevStart, lte: prevEnd } } }),
    prisma.transaction.groupBy({ by: ['categoryId'], where: { type: 'EXPENSE', date: { gte: start, lte: end } }, _sum: { amount: true } }),
  ])

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)
  const totalIncome = currentTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = currentTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)
  const prevIncome = prevTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const prevExpense = prevTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)

  const incomeTrend = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : undefined
  const expenseTrend = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : undefined

  const spendingByCategory = catSpending.map(s => ({
    name: categories.find(c => c.id === s.categoryId)?.name ?? 'Outros',
    value: s._sum.amount ?? 0,
    color: categories.find(c => c.id === s.categoryId)?.color ?? '#6366F1',
  })).sort((a, b) => b.value - a.value)

  const last6 = getLast6Months()
  const monthlyData = await Promise.all(last6.map(async ({ month: m, year: y, label }) => {
    const mStart = new Date(y, m - 1, 1)
    const mEnd = new Date(y, m, 0, 23, 59, 59)
    const txs = await prisma.transaction.findMany({ where: { date: { gte: mStart, lte: mEnd } }, select: { type: true, amount: true } })
    return {
      month: label,
      income: txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    }
  }))

  return { accounts, categories, transactions: currentTxs.slice(0, 10), totalBalance, totalIncome, totalExpense, incomeTrend, expenseTrend, spendingByCategory, monthlyData }
}

export default async function DashboardPage() {
  const d = await getData()
  const now = new Date()

  return (
    <AppShell
      title="Dashboard"
      subtitle={now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
      action={<TransactionForm categories={d.categories} accounts={d.accounts} />}
    >
      {/* Welcome banner if no accounts */}
      {d.accounts.length === 0 && (
        <div className="glass-card rounded-2xl p-6 mb-5 border-primary/20 glow-amber">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-foreground mb-1">Bem-vindo ao FinanceOS</h2>
              <p className="text-sm text-muted-foreground mb-4">Comece criando uma conta para registar as suas finanças.</p>
              <Link href="/accounts" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium">
                <Plus className="w-4 h-4" /> Criar conta
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats — 2x2 grid on mobile */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard title="Saldo Total" value={d.totalBalance} icon={Wallet} variant="primary" />
        <StatCard title="Saldo do Mês" value={d.totalIncome - d.totalExpense} icon={DollarSign} />
        <StatCard title="Receitas" value={d.totalIncome} icon={TrendingUp} variant="income" trend={d.incomeTrend} />
        <StatCard title="Despesas" value={d.totalExpense} icon={TrendingDown} variant="expense" trend={d.expenseTrend} />
      </div>

      {/* Charts */}
      <div className="space-y-4 mb-5">
        <MonthlyChart data={d.monthlyData} />
        <SpendingChart data={d.spendingByCategory} />
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-serif text-base text-foreground">Recentes</h3>
          <Link href="/transactions" className="text-xs text-primary flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {d.transactions.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-2xl mb-2">💸</p>
            <p className="text-sm text-muted-foreground">Nenhuma transação este mês</p>
          </div>
        ) : (
          <div>
            {d.transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0 active:bg-secondary/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ backgroundColor: t.category.color + '20', color: t.category.color }}>
                    {t.category.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{t.description || t.category.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(t.date)}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ml-2 shrink-0 font-semibold text-sm tabular-nums ${t.type === 'INCOME' ? 'income-text' : 'expense-text'}`}>
                  {t.type === 'INCOME' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
