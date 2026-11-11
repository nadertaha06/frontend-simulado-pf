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

function classeBadge(valor) {
  const n = Number(valor)
  if (n < 5) return 'badge baixa'
  if (n < 8) return 'badge media'
  return 'badge alta'
}

export default function Lista({ itens, carregando, erro, onAtualizar }) {
  const [filtro, setFiltro] = useState('')

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

      {!erro && !carregando && itens.length === 0 && (
        <p className="vazio">Nenhum registro cadastrado ainda.</p>
      )}

      {visiveis.length > 0 && (
        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                {colunas.map((c) => (
                  <th key={c.nome}>{c.label}</th>
                ))}
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
