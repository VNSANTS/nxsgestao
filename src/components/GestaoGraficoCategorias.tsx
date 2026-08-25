import DonutChart from '@/components/DonutChart'
import { formatBRL } from '@/utils/format'
import { useResumoDoMes } from '@/hooks/useGestaoFinanceira'

export default function GestaoGraficoCategorias() {
  const { categoriasComGasto, despesas } = useResumoDoMes()

  if (despesas === 0) return null

  return (
    <div className="card-surface rounded-2xl p-4">
      <h3 className="text-[13px] font-display font-bold text-white mb-3">Gastos por categoria</h3>
      <div className="flex items-center gap-4">
        <DonutChart
          size={112}
          dados={categoriasComGasto.map((c) => ({ classe: c.nome, pct: c.pct, cor: c.cor }))}
        />
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {categoriasComGasto.slice(0, 5).map((c) => (
            <div key={c.categoriaId} className="flex items-center gap-2 text-[11.5px]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.cor }} />
              <span className="text-slate-300 truncate flex-1">{c.nome}</span>
              <span className="text-slate-500 shrink-0">{formatBRL(c.valor, 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
