import { AppShell } from '@/components/layout/AppShell'
import { prisma } from '@/lib/db'
import { Wallet, ArrowLeftRight, Tag, Target, RefreshCw, PieChart } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
  const [accounts, txs, cats, goals, recurring, budgets] = await Promise.all([
    prisma.account.count(), prisma.transaction.count(), prisma.category.count(),
    prisma.goal.count(), prisma.recurringTransaction.count(), prisma.budget.count(),
  ])

  const stats = [
    { label: 'Contas', value: accounts, icon: Wallet, href: '/accounts' },
    { label: 'Transações', value: txs, icon: ArrowLeftRight, href: '/transactions' },
    { label: 'Categorias', value: cats, icon: Tag, href: '#' },
    { label: 'Metas', value: goals, icon: Target, href: '/goals' },
    { label: 'Recorrentes', value: recurring, icon: RefreshCw, href: '/recurring' },
    { label: 'Orçamentos', value: budgets, icon: PieChart, href: '/budgets' },
  ]

  return (
    <AppShell title="Configurações" subtitle="FinanceOS v1.0">
      <div className="space-y-5">
        {/* Stats */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Resumo</p>
          </div>
          <div className="grid grid-cols-2">
            {stats.map(({ label, value, icon: Icon, href }, i) => (
              <Link key={label} href={href}
                className={`flex items-center gap-3 p-4 active:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'border-r border-border/50' : ''} ${i < 4 ? 'border-b border-border/50' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* App info */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">App</p>
          </div>
          {[
            ['Versão', '1.0.0'],
            ['Moeda', 'EUR (€)'],
            ['Banco de dados', 'SQLite local'],
            ['Tema', 'Dark'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center px-4 py-3.5 border-b border-border/50 last:border-0">
              <span className="text-sm text-muted-foreground">{k}</span>
              <span className="text-sm font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Stack</p>
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind v3', 'Prisma', 'SQLite', 'Recharts', 'PWA'].map(t => (
              <span key={t} className="text-[11px] bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        {/* Install instructions */}
        <div className="glass-card rounded-2xl p-4 border-primary/20">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">📱 Instalar no iPhone</p>
          <ol className="space-y-2">
            {[
              'Abra este app no Safari',
              'Toque no ícone de partilha (□↑)',
              'Toque em "Adicionar ao Ecrã Inicial"',
              'Toque em "Adicionar"',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppShell>
  )
}
