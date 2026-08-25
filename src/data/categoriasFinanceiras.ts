import type { CategoriaFinanceira } from '@/types'

// Categorias padrão sugeridas — todas opcionais no momento do lançamento.
// O usuário pode ocultar (nunca excluir de vez) e criar as próprias.
export const CATEGORIAS_PADRAO: CategoriaFinanceira[] = [
  { id: 'cat-alimentacao', nome: 'Alimentação', tipo: 'despesa', iconName: 'Receipt', cor: '#FFC93C', padrao: true },
  { id: 'cat-transporte', nome: 'Transporte', tipo: 'despesa', iconName: 'Fuel', cor: '#3B82F6', padrao: true },
  { id: 'cat-moradia', nome: 'Moradia', tipo: 'despesa', iconName: 'Building', cor: '#8B5CF6', padrao: true },
  { id: 'cat-lazer', nome: 'Lazer', tipo: 'despesa', iconName: 'Film', cor: '#EC4899', padrao: true },
  { id: 'cat-saude', nome: 'Saúde', tipo: 'despesa', iconName: 'HeartHandshake', cor: '#EF4444', padrao: true },
  { id: 'cat-educacao', nome: 'Educação', tipo: 'despesa', iconName: 'GraduationCap', cor: '#00D4FF', padrao: true },
  { id: 'cat-assinaturas', nome: 'Assinaturas', tipo: 'despesa', iconName: 'RefreshCw', cor: '#64748B', padrao: true },
  { id: 'cat-outros-despesa', nome: 'Outros', tipo: 'despesa', iconName: 'ClipboardList', cor: '#94A3B8', padrao: true },
  { id: 'cat-salario', nome: 'Salário', tipo: 'receita', iconName: 'Banknote', cor: '#22C55E', padrao: true },
  { id: 'cat-freelance', nome: 'Freelance', tipo: 'receita', iconName: 'Briefcase', cor: '#00D4FF', padrao: true },
  { id: 'cat-investimentos', nome: 'Investimentos', tipo: 'receita', iconName: 'TrendingUp', cor: '#FFC93C', padrao: true },
  { id: 'cat-outros-receita', nome: 'Outros', tipo: 'receita', iconName: 'ClipboardList', cor: '#94A3B8', padrao: true },
]
