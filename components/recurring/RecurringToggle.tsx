'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RecurringToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      await fetch('/api/recurring', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      })
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${active ? 'bg-primary' : 'bg-secondary'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${active ? 'translate-x-[18px]' : 'translate-x-1'}`} />
    </button>
  )
}
