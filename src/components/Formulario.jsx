// Formulário gerado a partir de CAMPOS (config.js): só entram os campos com noForm: true.
import { useState } from 'react'
import { CAMPOS, NOME_ITEM, TITULO_FORM } from '../config'

const camposForm = CAMPOS.filter((c) => c.noForm)

const valoresVazios = () =>
  Object.fromEntries(camposForm.map((c) => [c.nome, c.tipo === 'checkbox' ? false : '']))

// Converte o valor do input para o tipo que o backend espera
function converter(campo, valor) {
  if (campo.tipo === 'checkbox') return Boolean(valor)
  if (valor === '') return null
  if (campo.tipo === 'number') return Number(valor)
  if (campo.tipo === 'datetime') return new Date(valor).toISOString()
  return valor
}

function Campo({ campo, valor, onChange }) {
  const comum = {
    id: campo.nome,
    name: campo.nome,
    required: campo.obrigatorio,
    onChange: (e) => onChange(campo.tipo === 'checkbox' ? e.target.checked : e.target.value),
  }

  switch (campo.tipo) {
    case 'textarea':
      return <textarea rows={4} value={valor} {...comum} />
    case 'select':
      return (
        <select value={valor} {...comum}>
          <option value="">Selecione…</option>
          {(campo.opcoes || []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )
    case 'checkbox':
      return <input type="checkbox" checked={valor} {...comum} />
    case 'datetime':
      return <input type="datetime-local" value={valor} {...comum} />
    default:
      return (
        <input
          type={campo.tipo}
          min={campo.min}
          max={campo.max}
          step={campo.step}
          value={valor}
          {...comum}
        />
      )
  }
}

export default function Formulario({ onSalvar }) {
  const [valores, setValores] = useState(valoresVazios)
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensagem(null)
    try {
      const dados = Object.fromEntries(camposForm.map((c) => [c.nome, converter(c, valores[c.nome])]))
      await onSalvar(dados)
      setValores(valoresVazios())
      setMensagem({ tipo: 'ok', texto: 'Artigo criado com sucesso.' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="cartao">
      <h2>{TITULO_FORM}</h2>
      <form onSubmit={enviar} className="formulario">
        {camposForm.map((campo) => (
          <div key={campo.nome} className={`campo ${campo.tipo === 'checkbox' ? 'campo-check' : ''}`}>
            <label htmlFor={campo.nome}>
              {campo.label}
              {campo.min !== undefined && campo.max !== undefined && (
                <span className="dica"> ({campo.min} a {campo.max})</span>
              )}
              {campo.obrigatorio && <span className="obrigatorio"> *</span>}
            </label>
            <Campo
              campo={campo}
              valor={valores[campo.nome]}
              onChange={(v) => setValores((atual) => ({ ...atual, [campo.nome]: v }))}
            />
          </div>
        ))}

        {mensagem && <p className={`alerta ${mensagem.tipo}`}>{mensagem.texto}</p>}

        <button type="submit" className="botao primario largo" disabled={enviando}>
          {enviando ? 'Salvando…' : `Cadastrar ${NOME_ITEM}`}
        </button>
      </form>
    </section>
  )
}
