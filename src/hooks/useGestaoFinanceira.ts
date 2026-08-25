import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CategoriaFinanceira, ContaFinanceira, GestaoFinanceiraState, Lancamento, OrcamentoMensal } from '@/types'
import { CATEGORIAS_PADRAO } from '@/data/categoriasFinanceiras'

const STORAGE_KEY = 'nexus-finance-gestao'
const PERSIST_DEBOUNCE_MS = 400

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function mesRefDe(dataIso: string): string {
  return dataIso.slice(0, 7) // 'YYYY-MM'
}

function defaultState(): GestaoFinanceiraState {
  return {
    contas: [
      {
        id: 'conta-principal',
        nome: 'Carteira',
        tipo: 'carteira',
        saldoInicial: 0,
        cor: '#22C55E',
        iconName: 'Wallet2',
        arquivada: false,
        createdAt: todayStr(),
      },
    ],
    categorias: CATEGORIAS_PADRAO,
    lancamentos: [],
    orcamento: { limiteTotal: null, limitesPorCategoria: {} },
  }
}

// Migração defensiva: um campo ausente ou corrompido não pode derrubar a tela.
function carregar(): GestaoFinanceiraState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<GestaoFinanceiraState>
    return {
      contas: Array.isArray(parsed.contas) && parsed.contas.length > 0 ? parsed.contas : base.contas,
      categorias: Array.isArray(parsed.categorias) && parsed.categorias.length > 0 ? parsed.categorias : base.categorias,
      lancamentos: Array.isArray(parsed.lancamentos) ? parsed.lancamentos : [],
      orcamento:
        parsed.orcamento && typeof parsed.orcamento === 'object'
          ? { limiteTotal: parsed.orcamento.limiteTotal ?? null, limitesPorCategoria: parsed.orcamento.limitesPorCategoria ?? {} }
          : base.orcamento,
    }
  } catch {
    return base
  }
}

function useGestaoStore() {
  const stateRef = useRef<GestaoFinanceiraState | null>(null)
  if (stateRef.current === null) stateRef.current = carregar()
  const [, notificar] = useReducer((n: number) => n + 1, 0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const persistir = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))
    } catch {
      // modo privado / cota cheia: segue funcionando só em memória
    }
  }, [])

  const update = useCallback(
    (fn: (s: GestaoFinanceiraState) => GestaoFinanceiraState) => {
      const atual = stateRef.current!
      const proximo = fn(atual)
      if (proximo === atual) return
      stateRef.current = proximo
      notificar()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(persistir, PERSIST_DEBOUNCE_MS)
    },
    [persistir]
  )

  useEffect(() => {
    const flush = () => {
      if (timerRef.current) persistir()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [persistir])

  const state = stateRef.current!

  const addLancamento = useCallback(
    (dados: Omit<Lancamento, 'id' | 'createdAt'>) => {
      const lancamento: Lancamento = { ...dados, id: uid(), createdAt: new Date().toISOString() }
      update((prev) => ({ ...prev, lancamentos: [lancamento, ...prev.lancamentos] }))
      return lancamento
    },
    [update]
  )

  const updateLancamento = useCallback(
    (id: string, dados: Partial<Omit<Lancamento, 'id' | 'createdAt'>>) => {
      update((prev) => ({
        ...prev,
        lancamentos: prev.lancamentos.map((l) => (l.id === id ? { ...l, ...dados } : l)),
      }))
    },
    [update]
  )

  const deleteLancamento = useCallback(
    (id: string) => {
      update((prev) => ({ ...prev, lancamentos: prev.lancamentos.filter((l) => l.id !== id) }))
    },
    [update]
  )

  const addConta = useCallback(
    (dados: Omit<ContaFinanceira, 'id' | 'createdAt' | 'arquivada'>) => {
      const conta: ContaFinanceira = { ...dados, id: uid(), arquivada: false, createdAt: todayStr() }
      update((prev) => ({ ...prev, contas: [...prev.contas, conta] }))
      return conta
    },
    [update]
  )

  const arquivarConta = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        contas: prev.contas.map((c) => (c.id === id ? { ...c, arquivada: true } : c)),
      }))
    },
    [update]
  )

  const addCategoria = useCallback(
    (dados: Omit<CategoriaFinanceira, 'id' | 'padrao'>) => {
      const categoria: CategoriaFinanceira = { ...dados, id: uid(), padrao: false }
      update((prev) => ({ ...prev, categorias: [...prev.categorias, categoria] }))
      return categoria
    },
    [update]
  )

  const removerCategoria = useCallback(
    (id: string) => {
      update((prev) => ({ ...prev, categorias: prev.categorias.filter((c) => c.id !== id || c.padrao) }))
    },
    [update]
  )

  const setOrcamento = useCallback(
    (orcamento: OrcamentoMensal) => {
      update((prev) => ({ ...prev, orcamento }))
    },
    [update]
  )

  return {
    state,
    addLancamento,
    updateLancamento,
    deleteLancamento,
    addConta,
    arquivarConta,
    addCategoria,
    removerCategoria,
    setOrcamento,
  }
}

type GestaoStore = ReturnType<typeof useGestaoStore>

const GestaoFinanceiraContext = createContext<GestaoStore | null>(null)

export function GestaoFinanceiraProvider({ children }: { children: ReactNode }) {
  const store = useGestaoStore()
  return createElement(GestaoFinanceiraContext.Provider, { value: store }, children)
}

export function useGestaoFinanceira() {
  const ctx = useContext(GestaoFinanceiraContext)
  if (!ctx) throw new Error('useGestaoFinanceira precisa estar dentro de <GestaoFinanceiraProvider>')
  return ctx
}

// --- Seletores derivados, prontos para os componentes de gráfico/resumo ---

export function useResumoDoMes(mesRef: string = mesRefDe(todayStr())) {
  const { state } = useGestaoFinanceira()

  return useMemo(() => {
    const doMes = state.lancamentos.filter((l) => mesRefDe(l.data) === mesRef)
    const receitas = doMes.filter((l) => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0)
    const despesas = doMes.filter((l) => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0)

    const gastosPorCategoria = new Map<string, number>()
    for (const l of doMes) {
      if (l.tipo !== 'despesa') continue
      const chave = l.categoriaId ?? 'sem-categoria'
      gastosPorCategoria.set(chave, (gastosPorCategoria.get(chave) ?? 0) + l.valor)
    }
    const categoriasComGasto = Array.from(gastosPorCategoria.entries())
      .map(([categoriaId, valor]) => {
        const categoria = state.categorias.find((c) => c.id === categoriaId)
        return {
          categoriaId,
          nome: categoria?.nome ?? 'Sem categoria',
          cor: categoria?.cor ?? '#64748B',
          valor,
          pct: despesas > 0 ? (valor / despesas) * 100 : 0,
        }
      })
      .sort((a, b) => b.valor - a.valor)

    const saldoTotal =
      state.contas.filter((c) => !c.arquivada).reduce((s, c) => s + c.saldoInicial, 0) +
      state.lancamentos.reduce((s, l) => s + (l.tipo === 'receita' ? l.valor : -l.valor), 0)

    return {
      lancamentosDoMes: doMes.sort((a, b) => b.data.localeCompare(a.data) || b.createdAt.localeCompare(a.createdAt)),
      receitas,
      despesas,
      saldoDoMes: receitas - despesas,
      saldoTotal,
      categoriasComGasto,
    }
  }, [state.lancamentos, state.categorias, state.contas, mesRef])
}

// Evolução do saldo total nos últimos `meses` meses (fim de cada mês).
export function useEvolucaoSaldo(meses = 6) {
  const { state } = useGestaoFinanceira()

  return useMemo(() => {
    const saldoInicialContas = state.contas.filter((c) => !c.arquivada).reduce((s, c) => s + c.saldoInicial, 0)
    const hoje = new Date()
    const pontos: { mes: string; saldo: number }[] = []

    // Ordena lançamentos por data para acumular progressivamente.
    const ordenados = [...state.lancamentos].sort((a, b) => a.data.localeCompare(b.data))

    for (let i = meses - 1; i >= 0; i--) {
      const ref = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const fimDoMes = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).toISOString().slice(0, 10)
      const saldoAteAqui = ordenados
        .filter((l) => l.data <= fimDoMes)
        .reduce((s, l) => s + (l.tipo === 'receita' ? l.valor : -l.valor), saldoInicialContas)
      pontos.push({
        mes: ref.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        saldo: saldoAteAqui,
      })
    }
    return pontos
  }, [state.lancamentos, state.contas, meses])
}

export { mesRefDe, todayStr }
