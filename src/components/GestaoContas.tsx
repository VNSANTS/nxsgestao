import { useState } from 'react'
import { Plus } from 'lucide-react'
import Icon from '@/components/Icon'
import { formatBRL } from '@/utils/format'
import { useGestaoFinanceira } from '@/hooks/useGestaoFinanceira'

const CORES_DISPONIVEIS = ['#22C55E', '#00D4FF', '#FFC93C', '#EC4899', '#8B5CF6', '#3B82F6']

export default function GestaoContas() {
  const { state, addConta } = useGestaoFinanceira()
  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')
  const [saldo, setSaldo] = useState('')

  const contasAtivas = state.contas.filter((c) => !c.arquivada)

  function saldoAtualDaConta(contaId: string, saldoInicial: number): number {
    return state.lancamentos
      .filter((l) => l.contaId === contaId)
      .reduce((s, l) => s + (l.tipo === 'receita' ? l.valor : -l.valor), saldoInicial)
  }

  function salvar() {
    if (!nome.trim()) return
    const cor = CORES_DISPONIVEIS[contasAtivas.length % CORES_DISPONIVEIS.length]
    addConta({ nome: nome.trim(), tipo: 'outra', saldoInicial: Number(saldo.replace(',', '.')) || 0, cor, iconName: 'Wallet' })
    setNome('')
    setSaldo('')
    setCriando(false)
  }

  return (
    <div>
      <h3 className="text-[13px] font-display font-bold text-white mb-3">Contas e carteiras</h3>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {contasAtivas.map((c) => (
          <div key={c.id} className="shrink-0 card-surface rounded-2xl p-3.5 min-w-[130px]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${c.cor}22` }}>
              <Icon name={c.iconName} size={15} style={{ color: c.cor }} />
            </div>
            <p className="text-[11.5px] text-slate-400 truncate">{c.nome}</p>
            <p className="text-[13px] font-display font-bold text-white">
              {formatBRL(saldoAtualDaConta(c.id, c.saldoInicial))}
            </p>
          </div>
        ))}

        {criando ? (
          <div className="shrink-0 card-surface rounded-2xl p-3.5 min-w-[160px] flex flex-col gap-1.5">
            <input
              autoFocus
              placeholder="Nome da conta"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-transparent text-[12px] text-white outline-none border-b border-border pb-1"
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="Saldo inicial"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              className="bg-transparent text-[12px] text-white outline-none"
            />
            <button onClick={salvar} className="mt-1 text-[11px] font-bold text-accent-green text-left">
              Salvar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCriando(true)}
            className="shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border min-w-[90px] text-slate-500"
          >
            <Plus size={16} />
            <span className="text-[11px] font-semibold">Conta</span>
          </button>
        )}
      </div>
    </div>
  )
}
