import { ArrowDownCircle, ArrowUpCircle, Wallet2 } from 'lucide-react'
import { formatBRL } from '@/utils/format'
import { useResumoDoMes } from '@/hooks/useGestaoFinanceira'

export default function GestaoResumoCards() {
  const { saldoTotal, receitas, despesas } = useResumoDoMes()

  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #22C55E14, #00D4FF14)', border: '1px solid #22C55E33' }}
      >
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
          <Wallet2 size={13} /> SALDO TOTAL
        </div>
        <p className="text-[28px] font-display font-extrabold text-white leading-tight">{formatBRL(saldoTotal)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card-surface rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-accent-green text-[11px] font-semibold mb-1">
            <ArrowUpCircle size={13} /> Receitas
          </div>
          <p className="text-base font-display font-bold text-white">{formatBRL(receitas)}</p>
        </div>
        <div className="card-surface rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-accent-red text-[11px] font-semibold mb-1">
            <ArrowDownCircle size={13} /> Despesas
          </div>
          <p className="text-base font-display font-bold text-white">{formatBRL(despesas)}</p>
        </div>
      </div>
    </div>
  )
}
