'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Category { id: string; name: string; type: string; color: string }
interface Account { id: string; name: string }

export function TransactionForm({ categories, accounts }: { categories: Category[], accounts: Account[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const filteredCategories = categories.filter(c => c.type === type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !categoryId || !accountId) return
    setLoading(true)
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description, categoryId, accountId, date, type }),
      })
      setOpen(false)
      setAmount(''); setDescription(''); setCategoryId(''); setAccountId('')
      setDate(new Date().toISOString().split('T')[0])
      router.refresh()
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
          <Plus className="w-4 h-4" /> Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground">Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Type toggle */}
          <div className="flex rounded-xl bg-secondary p-1 gap-1">
            {(['EXPENSE', 'INCOME'] as const).map(t => (
              <button key={t} type="button"
                onClick={() => { setType(t); setCategoryId('') }}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  type === t
                    ? t === 'EXPENSE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:text-foreground')}>
                {t === 'EXPENSE' ? 'Despesa' : 'Receita'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
              <Input type="number" step="0.01" placeholder="0,00" className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Descrição</Label>
            <Input placeholder="Ex: Almoço, Uber, Netflix..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {filteredCategories.map(c => (
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

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Data</Label>
            <Input type="date" className="bg-secondary border-border text-foreground"
              value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
            {loading ? 'Salvando...' : 'Salvar Transação'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
