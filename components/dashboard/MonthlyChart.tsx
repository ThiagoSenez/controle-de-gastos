'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface MonthlyData {
  month: string
  income: number
  expense: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 text-xs shadow-xl space-y-1.5">
        <p className="text-muted-foreground font-semibold uppercase tracking-wide mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Receitas:</span>
          <span className="income-text font-semibold">{formatCurrency(payload[0]?.value ?? 0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-muted-foreground">Despesas:</span>
          <span className="expense-text font-semibold">{formatCurrency(payload[1]?.value ?? 0)}</span>
        </div>
      </div>
    )
  }
  return null
}

export function MonthlyChart({ data, hasData }: { data: MonthlyData[], hasData: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-serif text-lg text-foreground">Evolução Mensal</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Receitas vs despesas — últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Receitas</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Despesas</span>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-52 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Sem dados ainda</p>
            <p className="text-xs text-muted-foreground mt-1">O gráfico aparece conforme você registra transações</p>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false}
                tickFormatter={v => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#34D399" strokeWidth={2} fill="url(#gradIncome)" dot={false} activeDot={{ r: 4, fill: '#34D399', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="expense" stroke="#F87171" strokeWidth={2} fill="url(#gradExpense)" dot={false} activeDot={{ r: 4, fill: '#F87171', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
