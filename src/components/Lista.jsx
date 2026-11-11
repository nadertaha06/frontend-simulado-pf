// Tabela gerada a partir de CAMPOS (config.js): só entram os campos com naTabela: true.
import { useMemo, useState } from 'react'
import { CAMPOS, TITULO } from '../config'

const colunas = CAMPOS.filter((c) => c.naTabela)

// Datas sem fuso vindas do backend são tratadas como UTC
function paraData(valor) {
  const s = String(valor)
  const temFuso = /([zZ]|[+-]\d{2}:?\d{2})$/.test(s)
  return new Date(!temFuso && s.includes('T') ? `${s}Z` : s)
}

function formatar(campo, valor) {
  if (valor === null || valor === undefined || valor === '') return '—'
  if (campo.tipo === 'datetime') {
    return paraData(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  }
  if (campo.tipo === 'date') {
    const [a, m, d] = String(valor).slice(0, 10).split('-')
    return `${d}/${m}/${a}`
  }
  if (campo.tipo === 'checkbox') return valor ? 'Sim' : 'Não'
  return String(valor)
}

// Prioridade: ALTA em vermelho, MEDIA em amarelo, BAIXA em verde. Número: nota de 0 a 10.
const BADGE_PRIORIDADE = { BAIXA: 'badge alta', MEDIA: 'badge media', ALTA: 'badge baixa' }

function classeBadge(valor) {
  if (BADGE_PRIORIDADE[valor]) return BADGE_PRIORIDADE[valor]
  const n = Number(valor)
  if (n < 5) return 'badge baixa'
  if (n < 8) return 'badge media'
  return 'badge alta'
}

// onExcluir só é passado quando MOSTRAR_EXCLUIR = true no config.js (e o usuário tem a role)
export default function Lista({ itens, carregando, erro, onAtualizar, onExcluir }) {
  const [filtro, setFiltro] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [excluindo, setExcluindo] = useState(null)

  async function excluir(id) {
    setErroAcao('')
    setExcluindo(id)
    try {
      await onExcluir(id)
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setExcluindo(null)
    }
  }

  const visiveis = useMemo(() => {
    const f = filtro.trim().toLowerCase()
    if (!f) return itens
    return itens.filter((item) =>
      colunas.some((c) => formatar(c, item[c.nome]).toLowerCase().includes(f)),
    )
  }, [itens, filtro])

  return (
    <section className="cartao">
      <div className="lista-topo">
        <h2>
          {TITULO} <span className="contador">{itens.length}</span>
        </h2>
        <div className="lista-acoes">
          <input
            type="search"
            placeholder="Filtrar…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar lista"
          />
          <button className="botao" onClick={onAtualizar} disabled={carregando}>
            {carregando ? 'Atualizando…' : 'Atualizar'}
          </button>
        </div>
      </div>

      {erro && <p className="alerta erro">{erro}</p>}
      {erroAcao && <p className="alerta erro">{erroAcao}</p>}

      {!erro && !carregando && itens.length === 0 && (
        <p className="vazio">Nenhum artigo cadastrado ainda.</p>
      )}

      {visiveis.length > 0 && (
        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                {colunas.map((c) => (
                  <th key={c.nome}>{c.label}</th>
                ))}
                {onExcluir && <th aria-label="Ações" />}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((item, i) => (
                <tr key={item.id ?? i}>
                  {colunas.map((c) => (
                    <td key={c.nome} data-label={c.label} className={`col-${c.tipo}`}>
                      {c.badge ? (
                        <span className={classeBadge(item[c.nome])}>{formatar(c, item[c.nome])}</span>
                      ) : (
                        formatar(c, item[c.nome])
                      )}
                    </td>
                  ))}
                  {onExcluir && (
                    <td className="col-acoes">
                      <button
                        className="botao perigo"
                        onClick={() => excluir(item.id)}
                        disabled={excluindo === item.id}
                      >
                        {excluindo === item.id ? 'Excluindo…' : 'Excluir'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {itens.length > 0 && visiveis.length === 0 && <p className="vazio">Nada encontrado para “{filtro}”.</p>}
    </section>
  )
}
