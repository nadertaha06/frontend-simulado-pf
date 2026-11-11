// Chamadas à API. Para uma rota nova, copie listar/cadastrar e ajuste.
import { API_URL, ROTA } from './config'

async function request(token, caminho, opcoes = {}) {
  const resp = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opcoes.headers,
    },
  })

  if (!resp.ok) {
    let detalhe = resp.statusText
    try {
      const corpo = await resp.json()
      detalhe = formatarDetalhe(corpo.detail) || detalhe
    } catch {
      /* resposta sem JSON */
    }
    throw new Error(`${resp.status} - ${detalhe}`)
  }

  return resp.status === 204 ? null : resp.json()
}

// FastAPI devolve erros de validação (422) como lista: [{loc, msg}, ...]
function formatarDetalhe(detail) {
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.at(-1) ?? ''}: ${d.msg}`).join(' | ')
  }
  return typeof detail === 'string' ? detail : JSON.stringify(detail)
}

// GET /avaliacoes
export const listar = (token) => request(token, ROTA)

// POST /avaliacoes
export const cadastrar = (token, dados) =>
  request(token, ROTA, { method: 'POST', body: JSON.stringify(dados) })

// Exemplos se a prova pedir:
// export const buscar   = (token, id)        => request(token, `${ROTA}/${id}`)
// export const deletar  = (token, id)        => request(token, `${ROTA}/${id}`, { method: 'DELETE' })
// export const atualizar = (token, id, dados) =>
//   request(token, `${ROTA}/${id}`, { method: 'PUT', body: JSON.stringify(dados) })
