'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ACCOUNT_TYPES = [
  { value: 'WALLET', label: 'Carteira' },
  { value: 'CHECKING', label: 'Conta Corrente' },
  { value: 'SAVINGS', label: 'Poupança' },
  { value: 'INVESTMENT', label: 'Investimento' },
]

const COLORS = ['#F59E0B','#6366F1','#3B82F6','#10B981','#EC4899','#8B5CF6','#F97316','#EF4444','#14B8A6','#84CC16']

export function AccountForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('CHECKING')
  const [balance, setBalance] = useState('')
  const [color, setColor] = useState('#6366F1')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, balance: Number(balance || 0), color }),
      })
      setOpen(false)
      setName(''); setType('CHECKING'); setBalance(''); setColor('#6366F1')
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
          <Plus className="w-4 h-4" /> Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground">Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nome</Label>
            <Input placeholder="Ex: Millennium, Carteira, Poupança..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {ACCOUNT_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value} className="text-foreground focus:bg-secondary">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Saldo Inicial</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
              <Input type="number" step="0.01" placeholder="0,00" className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                value={balance} onChange={e => setBalance(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: color === c ? 'white' : 'transparent' }} />
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
