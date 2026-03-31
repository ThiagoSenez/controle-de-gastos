import { AppShell } from '@/components/layout/AppShell'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { DeleteTransaction } from '@/components/transactions/DeleteTransaction'
import { prisma } from '@/lib/db'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react'

export default async function TransactionsPage() {
  const [transactions, categories, accounts] = await Promise.all([
    prisma.transaction.findMany({ include: { category: true, account: true }, orderBy: { date: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.account.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)

  return (
    <AppShell title="Transações" subtitle={`${transactions.length} transações`}
      action={<TransactionForm categories={categories} accounts={accounts} />}>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass-card rounded-2xl p-3.5">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Receitas</p>
          <p className="text-sm font-semibold income-text tabular-nums">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="glass-card rounded-2xl p-3.5">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Despesas</p>
          <p className="text-sm font-semibold expense-text tabular-nums">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="glass-card rounded-2xl p-3.5">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Saldo</p>
          <p className={`text-sm font-semibold tabular-nums ${totalIncome - totalExpense >= 0 ? 'income-text' : 'expense-text'}`}>
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-base text-foreground mb-1">Nenhuma transação</p>
          <p className="text-sm text-muted-foreground">Toque em "Nova Transação" para começar</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {transactions.map((t, i) => (
            <div key={t.id}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 active:bg-secondary/50 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ backgroundColor: t.category.color + '20', color: t.category.color }}>
                {t.category.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.description || t.category.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                    style={{ backgroundColor: t.category.color + '15', color: t.category.color }}>
                    {t.category.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(t.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-0.5 font-semibold text-sm tabular-nums ${t.type === 'INCOME' ? 'income-text' : 'expense-text'}`}>
                  {t.type === 'INCOME' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {formatCurrency(t.amount)}
                </div>
                <DeleteTransaction id={t.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
