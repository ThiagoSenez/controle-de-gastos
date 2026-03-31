import { AppShell } from '@/components/layout/AppShell'
import { AccountForm } from '@/components/accounts/AccountForm'
import { prisma } from '@/lib/db'
import { formatCurrency, ACCOUNT_TYPE_LABELS } from '@/lib/utils'
import { Wallet, Building2, PiggyBank, TrendingUp } from 'lucide-react'

const ICONS: Record<string, any> = { WALLET: Wallet, CHECKING: Building2, SAVINGS: PiggyBank, INVESTMENT: TrendingUp }

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({ orderBy: { createdAt: 'asc' } })
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)

  return (
    <AppShell title="Contas" subtitle="As suas contas financeiras" action={<AccountForm />}>
      {/* Total balance hero */}
      <div className="glass-card rounded-2xl p-5 mb-5 border-primary/20 glow-amber">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Patrimônio Total</p>
        <p className="font-serif text-3xl text-foreground">{formatCurrency(totalBalance)}</p>
        <p className="text-xs text-muted-foreground mt-1">{accounts.length} conta{accounts.length !== 1 ? 's' : ''}</p>
      </div>

      {accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-base text-foreground mb-1">Nenhuma conta</p>
          <p className="text-sm text-muted-foreground">Crie uma conta para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map(account => {
            const Icon = ICONS[account.type] ?? Wallet
            return (
              <div key={account.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: account.color + '20', color: account.color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{account.name}</p>
                  <p className="text-[11px] text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</p>
                </div>
                <p className="text-base font-semibold text-foreground tabular-nums shrink-0">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
