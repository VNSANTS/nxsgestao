import { useState } from 'react'
import { Target } from 'lucide-react'
import ProgressRing from '@/components/ProgressRing'
import { formatBRL } from '@/utils/format'
import { useGestaoFinanceira, useResumoDoMes } from '@/hooks/useGestaoFinanceira'

export default function GestaoOrcamento() {
  const { state, setOrcamento } = useGestaoFinanceira()
  const { despesas } = useResumoDoMes()
  const [editando, setEditando] = useState(false)
  const [valorInput, setValorInput] = useState('')

  const limite = state.orcamento.limiteTotal

  function salvar() {
    const num = Number(valorInput.replace(',', '.'))
    setOrcamento({ ...state.orcamento, limiteTotal: num > 0 ? num : null })
    setEditando(false)
    setValorInput('')
  }

  if (limite === null && !editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="w-full flex items-center gap-3 card-surface rounded-2xl p-4 text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-accent-gold/15 flex items-center justify-center shrink-0">
          <Target size={17} className="text-accent-gold" />
        </div>
        <p className="text-[12.5px] text-slate-300">
          <span className="font-semibold text-white">Definir orçamento mensal.</span> Acompanhe quanto já gastou em
          relação ao seu limite do mês.
        </p>
      </button>
    )
  }

  if (editando) {
    return (
      <div className="card-surface rounded-2xl p-4">
        <p className="text-[12px] font-semibold text-slate-400 mb-2">Limite de gastos do mês (R$)</p>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder={limite ? String(limite) : '0,00'}
            value={valorInput}
            onChange={(e) => setValorInput(e.target.value)}
            className="flex-1 bg-transparent border border-border rounded-xl px-3 py-2 text-sm text-white outline-none"
            autoFocus
          />
          <button onClick={salvar} className="px-4 rounded-xl bg-accent-green text-bg text-sm font-bold">
            Salvar
          </button>
        </div>
      </div>
    )
  }

  const pct = limite ? Math.min((despesas / limite) * 100, 100) : 0
  const estourou = limite !== null && despesas > limite

  return (
    <div className="card-surface rounded-2xl p-4 flex items-center gap-4">
      <ProgressRing progress={pct} size={76} strokeWidth={8}>
        <span
          className="text-sm font-display font-extrabold"
          style={{ color: estourou ? '#EF4444' : '#F4F6FA' }}
        >
          {Math.round(pct)}%
        </span>
      </ProgressRing>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-slate-400">
          {formatBRL(despesas)} de {formatBRL(limite ?? 0)}
        </p>
        <p className={`text-[11px] mt-0.5 ${estourou ? 'text-accent-red' : 'text-slate-500'}`}>
          {estourou ? 'Orçamento estourado este mês' : 'dentro do orçamento do mês'}
        </p>
        <button onClick={() => setEditando(true)} className="text-[11px] text-accent-cyan font-semibold mt-1.5">
          Editar limite
        </button>
      </div>
    </div>
  )
}
