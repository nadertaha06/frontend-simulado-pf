import { useCallback, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import {
  MOSTRAR_EXCLUIR,
  ROLES_CLAIM,
  ROLES_PODE_CADASTRAR,
  ROLES_PODE_EXCLUIR,
  SUBTITULO,
  TITULO,
} from './config'
import { cadastrar, deletar, listar } from './api'
import Formulario from './components/Formulario'
import Lista from './components/Lista'

// Lê o payload do JWT (sem validar: quem valida é o backend) para saber as roles.
function lerClaims(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return {}
  }
}

export default function App() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0()

  const [roles, setRoles] = useState([])
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erroLista, setErroLista] = useState('')

  const pegarToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently()
    } catch (e) {
      if (['login_required', 'consent_required', 'missing_refresh_token'].includes(e.error)) {
        await loginWithRedirect()
      }
      throw e
    }
  }, [getAccessTokenSilently, loginWithRedirect])

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErroLista('')
    try {
      const token = await pegarToken()
      const claims = lerClaims(token)
      setRoles((claims[ROLES_CLAIM] || []).map((r) => String(r).toUpperCase()))
      setItens(await listar(token))
    } catch (e) {
      setErroLista(e.message)
    } finally {
      setCarregando(false)
    }
  }, [pegarToken])

  useEffect(() => {
    if (isAuthenticated) carregar()
  }, [isAuthenticated, carregar])

  async function salvar(dados) {
    const token = await pegarToken()
    await cadastrar(token, dados)
    await carregar()
  }

  async function remover(id) {
    const token = await pegarToken()
    await deletar(token, id)
    await carregar()
  }

  if (isLoading) {
    return (
      <main className="centro">
        <p className="suave">Carregando…</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="centro">
        <div className="cartao entrar">
          <span className="marca" aria-hidden="true">★</span>
          <h1>{TITULO}</h1>
          <p className="suave">{SUBTITULO}</p>
          {error && <p className="alerta erro">{error.message}</p>}
          <button className="botao primario largo" onClick={() => loginWithRedirect()}>
            Entrar
          </button>
        </div>
      </main>
    )
  }

  const podeCadastrar = roles.some((r) => ROLES_PODE_CADASTRAR.includes(r))
  const podeExcluir = MOSTRAR_EXCLUIR && roles.some((r) => ROLES_PODE_EXCLUIR.includes(r))

  return (
    <>
      <header className="topo">
        <div className="topo-titulo">
          <span className="marca pequena" aria-hidden="true">★</span>
          <div>
            <h1>{TITULO}</h1>
            <p className="suave">{SUBTITULO}</p>
          </div>
        </div>
        <div className="topo-usuario">
          <div className="usuario-info">
            <span className="usuario-email">{user?.email || user?.name}</span>
            <span className="roles">
              {roles.length ? (
                roles.map((r) => (
                  <span key={r} className={`chip ${r === 'ADMIN' ? 'chip-admin' : ''}`}>
                    {r}
                  </span>
                ))
              ) : (
                <span className="chip chip-vazio">sem role</span>
              )}
            </span>
          </div>
          <button
            className="botao"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="conteudo">
        {!carregando && roles.length === 0 && (
          <p className="alerta aviso">
            Seu token não tem nenhuma role. No Auth0, atribua ADMIN ou USER ao usuário (User Management
            › Users › Roles), confira se a Action está no fluxo de Login e depois saia e entre de novo.
          </p>
        )}

        <div className={`grade ${podeCadastrar ? '' : 'grade-unica'}`}>
          {podeCadastrar && <Formulario onSalvar={salvar} />}
          <Lista
            itens={itens}
            carregando={carregando}
            erro={erroLista}
            onAtualizar={carregar}
            onExcluir={podeExcluir ? remover : undefined}
          />
        </div>
      </main>
    </>
  )
}
