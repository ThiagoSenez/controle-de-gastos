'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn, formatCurrency } from '@/lib/utils'

interface Props {
  goalId: string
  goalName: string
  currentAmount: number
  targetAmount: number
  color: string
}

export function GoalDepositForm({ goalId, goalName, currentAmount, targetAmount, color }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'add' | 'remove' | 'set'>('add')

  const numAmount = Number(amount) || 0
  const preview =
    mode === 'add' ? currentAmount + numAmount :
    mode === 'remove' ? Math.max(0, currentAmount - numAmount) :
    numAmount

  const pct = Math.min((preview / targetAmount) * 100, 100)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || numAmount <= 0) return
    setLoading(true)
    try {
      await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: goalId, currentAmount: preview }),
      })
      setOpen(false)
      setAmount('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all">
          <Plus className="w-3.5 h-3.5" />
          Atualizar valor
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20', color }}>
              <Target className="w-4 h-4" />
            </div>
            {goalName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
          {/* Mode selector */}
          <div className="grid grid-cols-3 rounded-xl bg-secondary p-1 gap-1">
            {([['add', 'Adicionar'], ['remove', 'Remover'], ['set', 'Definir']] as const).map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={cn('py-1.5 rounded-lg text-xs font-medium transition-all',
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}>
                {label}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              {mode === 'set' ? 'Novo valor total' : `Valor a ${mode === 'add' ? 'adicionar' : 'remover'}`}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
              <Input type="number" step="0.01" min="0" placeholder="0,00"
                className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                value={amount} onChange={e => setAmount(e.target.value)} autoFocus required />
            </div>
          </div>

          {/* Preview */}
          {amount && (
            <div className="rounded-xl bg-secondary p-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Novo total</span>
                <span className="font-semibold text-foreground">{formatCurrency(preview)}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: preview >= targetAmount ? '#34D399' : color }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{pct.toFixed(0)}% da meta</span>
                <span>Meta: {formatCurrency(targetAmount)}</span>
              </div>
              {preview >= targetAmount && (
                <p className="text-xs text-center income-text font-medium pt-1">🎉 Meta atingida!</p>
              )}
            </div>
          )}

          <Button type="submit" disabled={loading || !amount}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
            {loading ? 'Guardando...' : 'Confirmar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
