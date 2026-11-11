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
    let detalhe = resp.statusText || 'erro'
    // 401: o Spring explica o motivo no header WWW-Authenticate (ex.: "The aud claim is not valid")
    const motivo401 = resp.headers.get('WWW-Authenticate')?.match(/error_description="([^"]*)"/)?.[1]
    if (motivo401) detalhe = `Token inválido: ${motivo401}`
    else if (resp.status === 401) detalhe = 'Token não enviado ou inválido'
    try {
      // Spring devolve {"status": 400, "message": "titulo é obrigatório", ...}
      const corpo = await resp.json()
      detalhe = corpo.message || corpo.detail || detalhe
    } catch {
      /* resposta sem JSON */
    }
    throw new Error(`${resp.status} - ${detalhe}`)
  }

  return resp.status === 204 ? null : resp.json()
}

// GET /artigos
export const listar = (token) => request(token, ROTA)

// POST /artigos
export const cadastrar = (token, dados) =>
  request(token, ROTA, { method: 'POST', body: JSON.stringify(dados) })

// DELETE /artigos/{id}  (usado pelo botão Excluir quando MOSTRAR_EXCLUIR = true no config.js)
export const deletar = (token, id) => request(token, `${ROTA}/${id}`, { method: 'DELETE' })

// Exemplos se a prova pedir:
// export const buscar    = (token, id)        => request(token, `${ROTA}/${id}`)
// export const atualizar = (token, id, dados) =>
//   request(token, `${ROTA}/${id}`, { method: 'PUT', body: JSON.stringify(dados) })
