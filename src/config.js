// =====================================================================
// ⭐ CONFIGURAÇÃO DO FRONT: o que muda na prova fica AQUI
// =====================================================================
// - ROTA ................. caminho da API (igual ao config.ROTA do backend)
// - ROLES_PODE_CADASTRAR . quem vê o formulário (o backend é quem bloqueia de verdade)
// - CAMPOS ............... campos da entidade: formulário e tabela são gerados daqui
// =====================================================================

// Textos da tela
export const TITULO = 'Avaliações'
export const SUBTITULO = 'Avaliações entre colaboradores da empresa'
export const NOME_ITEM = 'avaliação' // usado em "Nova avaliação", "Cadastrar avaliação"...

// ⭐ Rota da API. Fica: {API_URL}{ROTA}  ->  /api/avaliacoes
export const ROTA = '/avaliacoes'

// "/api" usa o proxy (vite.config.js em dev e vercel.json na Vercel).
// Só troque se quiser chamar o backend direto (ex.: http://localhost:8000).
export const API_URL = import.meta.env.VITE_API_URL || '/api'

// ⭐ Precisa ser IGUAL ao namespace da Action do Auth0 e do backend
export const NAMESPACE = 'https://avaliacoes-insper.com'
export const ROLES_CLAIM = `${NAMESPACE}/roles`

// ⭐ Quem pode ver o formulário de cadastro
export const ROLES_PODE_CADASTRAR = ['ADMIN']

// ---------------------------------------------------------------------
// ⭐ CAMPOS DA ENTIDADE
// ---------------------------------------------------------------------
//   nome        nome EXATO do campo no JSON do backend
//   label       texto que aparece na tela
//   tipo        'text' | 'email' | 'number' | 'textarea' | 'date' | 'datetime' | 'select' | 'checkbox'
//   noForm      true = aparece no formulário (é enviado no POST)
//   naTabela    true = aparece na listagem
//   obrigatorio true = campo required no formulário
//   min / max   limites para 'number'
//   step        passo para 'number' (padrão 1 = inteiro; use 0.5 ou 'any' para decimal)
//   opcoes      lista de opções para 'select', ex.: ['ATIVO', 'INATIVO']
//   badge       true = mostra o valor como selo colorido (0-4 vermelho, 5-7 amarelo, 8-10 verde)
//
// Campos que o SERVIDOR preenche (id, avaliador, data) ficam com noForm: false.
export const CAMPOS = [
  { nome: 'id', label: 'ID', tipo: 'number', noForm: false, naTabela: true },
  { nome: 'emailAvaliador', label: 'Avaliador', tipo: 'email', noForm: false, naTabela: true },
  {
    nome: 'emailAvaliado',
    label: 'Email do avaliado',
    tipo: 'email',
    noForm: true,
    naTabela: true,
    obrigatorio: true,
  },
  {
    nome: 'nota',
    label: 'Nota',
    tipo: 'number',
    min: 0,
    max: 10,
    noForm: true,
    naTabela: true,
    obrigatorio: true,
    badge: true,
  },
  {
    nome: 'comentarios',
    label: 'Comentários',
    tipo: 'textarea',
    noForm: true,
    naTabela: true,
    obrigatorio: true,
  },
  { nome: 'dataAvaliacao', label: 'Data', tipo: 'datetime', noForm: false, naTabela: true },
]
