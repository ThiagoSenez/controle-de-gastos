'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { PieChart as PieIcon } from 'lucide-react'

interface SpendingData { name: string; value: number; color: string }

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-foreground font-medium mb-1">{payload[0].name}</p>
        <p className="text-primary font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const renderLegend = (props: any) => (
  <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-2">
    {props.payload.map((entry: any, i: number) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
        <span className="text-[11px] text-muted-foreground">{entry.value}</span>
      </div>
    ))}
  </div>
)

export function SpendingChart({ data }: { data: SpendingData[] }) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <h3 className="font-serif text-lg text-foreground mb-0.5">Gastos por Categoria</h3>
      <p className="text-xs text-muted-foreground mb-4">Distribuição das despesas do mês</p>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-52 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <PieIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Sem despesas ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Registre gastos para ver a distribuição</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie data={data} cx="50%" cy="42%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
