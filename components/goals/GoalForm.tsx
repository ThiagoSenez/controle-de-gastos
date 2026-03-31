'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const COLORS = ['#F59E0B','#34D399','#3B82F6','#8B5CF6','#EC4899','#F97316','#10B981','#6366F1','#EF4444','#14B8A6']

export function GoalForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: '0', targetDate: '', color: '#F59E0B' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, targetDate: form.targetDate || undefined }),
      })
      setOpen(false)
      setForm({ name: '', targetAmount: '', currentAmount: '0', targetDate: '', color: '#F59E0B' })
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
          <Plus className="w-4 h-4" /> Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground">Nova Meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nome</Label>
            <Input placeholder="Ex: Viagem, Fundo de emergência..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Valor Alvo</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                <Input type="number" step="0.01" placeholder="0,00" className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Já tenho</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                <Input type="number" step="0.01" placeholder="0,00" className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  value={form.currentAmount} onChange={e => setForm(f => ({ ...f, currentAmount: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Data Limite (opcional)</Label>
            <Input type="date" className="bg-secondary border-border text-foreground"
              value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(color => (
                <button key={color} type="button" onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: color, borderColor: form.color === color ? 'white' : 'transparent' }} />
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
            {loading ? 'Criando...' : 'Criar Meta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
