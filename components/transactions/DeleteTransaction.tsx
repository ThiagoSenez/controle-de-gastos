'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteTransaction({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Remover esta transação?')) return
    setLoading(true)
    try {
      await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
