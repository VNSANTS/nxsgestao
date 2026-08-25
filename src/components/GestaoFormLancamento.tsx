import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Icon from '@/components/Icon'
import { useGestaoFinanceira, todayStr } from '@/hooks/useGestaoFinanceira'
import type { TipoLancamento } from '@/types'

interface Props {
  aberto: boolean
  onFechar: () => void
}

// Bottom sheet de novo lançamento. Categoria fica opcional de propósito —
// "liberdade total" é a promessa da tela, categoria só ajuda os gráficos.
export default function GestaoFormLancamento({ aberto, onFechar }: Props) {
  const { state, addLancamento } = useGestaoFinanceira()
  const [tipo, setTipo] = useState<TipoLancamento>('despesa')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState(todayStr())
  const [contaId, setContaId] = useState(state.contas.find((c) => !c.arquivada)?.id ?? '')
  const [categoriaId, setCategoriaId] = useState<string | null>(null)

  const contasAtivas = state.contas.filter((c) => !c.arquivada)
  const categoriasDoTipo = state.categorias.filter((c) => c.tipo === tipo)

  function limparEFechar() {
    setValor('')
    setDescricao('')
    setCategoriaId(null)
    setData(todayStr())
    onFechar()
  }

  function salvar() {
    const valorNumerico = Number(valor.replace(',', '.'))
    if (!valorNumerico || valorNumerico <= 0 || !contaId) return
    addLancamento({ tipo, valor: valorNumerico, data, descricao: descricao.trim(), categoriaId, contaId })
    limparEFechar()
  }

  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={limparEFechar}
          />
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[70]
                       bg-bg-card rounded-t-[24px] border-t border-border max-h-[88dvh] overflow-y-auto no-scrollbar"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+20px)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-display font-extrabold text-white">Novo lançamento</h2>
                <button onClick={limparEFechar} className="text-slate-400 p-1" aria-label="Fechar">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {(['despesa', 'receita'] as TipoLancamento[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTipo(t)
                      setCategoriaId(null)
                    }}
                    className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-colors"
                    style={
                      tipo === t
                        ? { background: t === 'despesa' ? '#EF444422' : '#22C55E22', color: t === 'despesa' ? '#EF4444' : '#22C55E', border: `1px solid ${t === 'despesa' ? '#EF444455' : '#22C55E55'}` }
                        : { background: 'transparent', color: '#64748B', border: '1px solid #1C2740' }
                    }
                  >
                    {t === 'despesa' ? 'Despesa' : 'Receita'}
                  </button>
                ))}
              </div>

              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Valor (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full bg-transparent text-3xl font-display font-extrabold text-white outline-none mb-4"
                autoFocus
              />

              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Descrição (opcional)</label>
              <input
                type="text"
                placeholder="Ex: mercado, uber, salário..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full card-surface rounded-xl px-3.5 py-2.5 text-sm text-white outline-none mb-4 placeholder:text-slate-600"
              />

              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                max={todayStr()}
                className="w-full card-surface rounded-xl px-3.5 py-2.5 text-sm text-white outline-none mb-4"
              />

              {contasAtivas.length > 0 && (
                <>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Conta</label>
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {contasAtivas.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setContaId(c.id)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={
                          contaId === c.id
                            ? { background: `${c.cor}22`, color: c.cor, border: `1px solid ${c.cor}55` }
                            : { background: 'transparent', color: '#94A3B8', border: '1px solid #1C2740' }
                        }
                      >
                        <Icon name={c.iconName} size={13} />
                        {c.nome}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Categoria (opcional)</label>
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setCategoriaId(null)}
                  className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
                  style={
                    categoriaId === null
                      ? { background: '#00D4FF22', color: '#00D4FF', border: '1px solid #00D4FF55' }
                      : { background: 'transparent', color: '#94A3B8', border: '1px solid #1C2740' }
                  }
                >
                  Sem categoria
                </button>
                {categoriasDoTipo.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoriaId(c.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
                    style={
                      categoriaId === c.id
                        ? { background: `${c.cor}22`, color: c.cor, border: `1px solid ${c.cor}55` }
                        : { background: 'transparent', color: '#94A3B8', border: '1px solid #1C2740' }
                    }
                  >
                    <Icon name={c.iconName} size={13} />
                    {c.nome}
                  </button>
                ))}
              </div>

              <button
                onClick={salvar}
                disabled={!valor || Number(valor) <= 0 || !contaId}
                className="w-full py-3.5 rounded-2xl bg-accent-green text-bg font-display font-extrabold text-sm disabled:opacity-40"
              >
                Salvar lançamento
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
