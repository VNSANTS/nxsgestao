import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Wallet2 } from 'lucide-react'
import { GestaoFinanceiraProvider } from '@/hooks/useGestaoFinanceira'
import GestaoResumoCards from '@/components/GestaoResumoCards'
import GestaoOrcamento from '@/components/GestaoOrcamento'
import GestaoGraficoCategorias from '@/components/GestaoGraficoCategorias'
import GestaoGraficoEvolucao from '@/components/GestaoGraficoEvolucao'
import GestaoContas from '@/components/GestaoContas'
import GestaoListaLancamentos from '@/components/GestaoListaLancamentos'
import GestaoFormLancamento from '@/components/GestaoFormLancamento'

// Área de Gestão Financeira pessoal — lançamentos livres (categoria sempre
// opcional), contas, orçamento mensal e os gráficos essenciais. Tudo salvo
// localmente no dispositivo, sem depender de backend.
function GestaoFinanceiraConteudo() {
  const navigate = useNavigate()
  const [formAberto, setFormAberto] = useState(false)

  return (
    <div className="px-4 pt-5 pb-10">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-slate-400 text-[13px] font-semibold mb-3.5">
        <ChevronLeft size={16} /> Início
      </button>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-accent-green/15 flex items-center justify-center">
            <Wallet2 size={22} className="text-accent-green" />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-white">Gestão Financeira</h1>
            <p className="text-xs text-slate-500">Acompanhe seus gastos, no seu ritmo</p>
          </div>
        </div>
        <button
          onClick={() => setFormAberto(true)}
          className="w-10 h-10 rounded-full bg-accent-green flex items-center justify-center shrink-0"
          aria-label="Novo lançamento"
        >
          <Plus size={20} className="text-bg" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <GestaoResumoCards />
        <GestaoOrcamento />
        <GestaoContas />
        <GestaoGraficoCategorias />
        <GestaoGraficoEvolucao />

        <div>
          <h3 className="text-[13px] font-display font-bold text-white mb-3">Lançamentos deste mês</h3>
          <GestaoListaLancamentos />
        </div>
      </div>

      <GestaoFormLancamento aberto={formAberto} onFechar={() => setFormAberto(false)} />
    </div>
  )
}

export default function GestaoFinanceiraPage() {
  return (
    <GestaoFinanceiraProvider>
      <GestaoFinanceiraConteudo />
    </GestaoFinanceiraProvider>
  )
}
