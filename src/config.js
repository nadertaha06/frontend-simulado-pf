// =====================================================================
// ⭐ CONFIGURAÇÃO DO FRONT: o que muda na prova fica AQUI
// =====================================================================
// - ROTA ................. caminho da API (igual ao @RequestMapping do ArtigoController)
// - ROLES_PODE_CADASTRAR . quem vê o formulário (o backend é quem bloqueia de verdade)
// - CAMPOS ............... campos da entidade: formulário e tabela são gerados daqui
// =====================================================================

// Textos da tela
export const TITULO = 'Base de conhecimentos'
export const SUBTITULO = 'Artigos da base de conhecimentos da empresa'
export const NOME_ITEM = 'artigo' // usado em "Cadastrar artigo"
export const TITULO_FORM = 'Novo artigo' // título do formulário

// ⭐ Rota da API. Fica: {API_URL}{ROTA}  ->  /api/artigos
export const ROTA = '/artigos'

// "/api" usa o proxy (vite.config.js em dev e vercel.json na Vercel).
// Só troque se quiser chamar o backend direto (ex.: http://localhost:8000).
export const API_URL = import.meta.env.VITE_API_URL || '/api'

// ⭐ Precisa ser IGUAL ao namespace da Action do Auth0 e do backend
export const NAMESPACE = 'https://avaliacoes-insper.com'
export const ROLES_CLAIM = `${NAMESPACE}/roles`

// ⭐ Quem pode ver o formulário de cadastro
export const ROLES_PODE_CADASTRAR = ['ADMIN']

// ⭐ Botão "Excluir" em cada linha da tabela.
// Precisa da rota DELETE no backend (ArtigoController.java).
export const MOSTRAR_EXCLUIR = true
export const ROLES_PODE_EXCLUIR = ['ADMIN']

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
//   badge       true = mostra o valor como selo colorido (BAIXA verde, MEDIA amarelo, ALTA vermelho;
//               em número: 0-4 vermelho, 5-7 amarelo, 8-10 verde)
//
// Campos que o SERVIDOR preenche (id, e-mail de quem criou, data) ficam com noForm: false.
export const CAMPOS = [
  { nome: 'id', label: 'ID', tipo: 'number', noForm: false, naTabela: true },
  {
    nome: 'titulo',
    label: 'Título',
    tipo: 'text',
    noForm: true,
    naTabela: true,
    obrigatorio: true,
  },
  {
    nome: 'descricao',
    label: 'Descrição',
    tipo: 'textarea',
    noForm: true,
    naTabela: true,
    obrigatorio: true,
  },
  {
    nome: 'prioridade',
    label: 'Prioridade',
    tipo: 'select',
    opcoes: ['BAIXA', 'MEDIA', 'ALTA'],
    noForm: true,
    naTabela: true,
    obrigatorio: true,
    badge: true,
  },
  { nome: 'emailUsuario', label: 'Criado por', tipo: 'email', noForm: false, naTabela: true },
  { nome: 'dataCriacao', label: 'Data', tipo: 'datetime', noForm: false, naTabela: true },
]
