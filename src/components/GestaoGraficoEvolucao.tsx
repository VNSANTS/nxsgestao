import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { formatCompactBRL, formatBRL } from '@/utils/format'
import { useEvolucaoSaldo } from '@/hooks/useGestaoFinanceira'

function TooltipCustom({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card-surface rounded-lg px-2.5 py-1.5 text-[11px] text-white">
      {formatBRL(payload[0].value)}
    </div>
  )
}

export default function GestaoGraficoEvolucao() {
  const pontos = useEvolucaoSaldo(6)

  return (
    <div className="card-surface rounded-2xl p-4">
      <h3 className="text-[13px] font-display font-bold text-white mb-3">Evolução do saldo</h3>
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <LineChart data={pontos} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10.5 }}
              interval={0}
            />
            <Tooltip content={<TooltipCustom />} cursor={{ stroke: '#1C2740' }} />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#00D4FF"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#00D4FF', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10.5px] text-slate-600 mt-1">
        Último saldo: {formatCompactBRL(pontos[pontos.length - 1]?.saldo ?? 0)}
      </p>
    </div>
  )
}
