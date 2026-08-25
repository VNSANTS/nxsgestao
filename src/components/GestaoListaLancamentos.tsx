import { Trash2 } from 'lucide-react'
import Icon from '@/components/Icon'
import { formatBRL } from '@/utils/format'
import { useGestaoFinanceira, useResumoDoMes } from '@/hooks/useGestaoFinanceira'

function formatarDataCurta(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano.slice(2)}`
}

export default function GestaoListaLancamentos() {
  const { state, deleteLancamento } = useGestaoFinanceira()
  const { lancamentosDoMes } = useResumoDoMes()

  if (lancamentosDoMes.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <p className="text-[13px] text-slate-500">Nenhum lançamento este mês ainda.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {lancamentosDoMes.map((l) => {
        const categoria = state.categorias.find((c) => c.id === l.categoriaId)
        const conta = state.contas.find((c) => c.id === l.contaId)
        return (
          <div key={l.id} className="flex items-center gap-3 card-surface rounded-2xl p-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${categoria?.cor ?? '#64748B'}22` }}
            >
              <Icon name={categoria?.iconName} size={16} style={{ color: categoria?.cor ?? '#64748B' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">
                {l.descricao || categoria?.nome || 'Sem descrição'}
              </p>
              <p className="text-[11px] text-slate-500">
                {formatarDataCurta(l.data)} · {conta?.nome ?? 'Conta removida'}
                {categoria ? ` · ${categoria.nome}` : ''}
              </p>
            </div>
            <p
              className="text-[13.5px] font-display font-bold shrink-0"
              style={{ color: l.tipo === 'receita' ? '#22C55E' : '#EF4444' }}
            >
              {l.tipo === 'receita' ? '+' : '-'} {formatBRL(l.valor)}
            </p>
            <button
              onClick={() => deleteLancamento(l.id)}
              className="text-slate-600 p-1 shrink-0"
              aria-label="Excluir lançamento"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
