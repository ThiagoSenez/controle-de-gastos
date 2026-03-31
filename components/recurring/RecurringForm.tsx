'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Category { id: string; name: string; color: string; type: string }
interface Account { id: string; name: string }

const FREQUENCIES = [
  { value: 'DAILY', label: 'Diário' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
]

export function RecurringForm({ categories, accounts }: { categories: Category[], accounts: Account[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('MONTHLY')
  const [nextDue, setNextDue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !amount || !categoryId || !accountId || !nextDue) return
    setLoading(true)
    try {
      await fetch('/api/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, frequency, nextDue, categoryId, accountId }),
      })
      setOpen(false)
      setName(''); setAmount(''); setFrequency('MONTHLY'); setNextDue(''); setCategoryId(''); setAccountId('')
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
          <Plus className="w-4 h-4" /> Novo Recorrente
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground">Pagamento Recorrente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nome</Label>
            <Input placeholder="Ex: Netflix, Aluguel, Internet..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                <Input type="number" step="0.01" placeholder="0,00" className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Frequência</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {FREQUENCIES.map(f => (
                    <SelectItem key={f.value} value={f.value} className="text-foreground focus:bg-secondary">{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Próximo vencimento</Label>
            <Input type="date" className="bg-secondary border-border text-foreground"
              value={nextDue} onChange={e => setNextDue(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {expenseCategories.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-foreground focus:bg-secondary">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Conta</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {accounts.map(a => (
                  <SelectItem key={a.id} value={a.id} className="text-foreground focus:bg-secondary">{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
            {loading ? 'Criando...' : 'Criar Recorrente'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
