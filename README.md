# Frontend: Avaliações (React + Vite + Auth0)

Tela única: login com Auth0, formulário de cadastro (só para quem tem `ADMIN`) e lista com filtro.
O formulário e a tabela são **gerados a partir da lista `CAMPOS`** em [src/config.js](src/config.js).

---

## ⭐ Onde mudar cada coisa na prova

Quase tudo está em **[src/config.js](src/config.js)**:

| A prova pede… | O que mudar |
|---|---|
| Mudar a rota (`/avaliacoes` → `/feedbacks`) | `ROTA` |
| Mudar textos da tela | `TITULO`, `SUBTITULO`, `NOME_ITEM` |
| Quem vê o formulário | `ROLES_PODE_CADASTRAR` |
| Adicionar / remover / renomear campo | lista `CAMPOS` (o `nome` tem que ser igual ao JSON do backend) |
| Campo aparece só na tabela / só no form | `naTabela` / `noForm` |
| Campo de escolha | `tipo: 'select', opcoes: ['A', 'B']` |
| Nota com decimal | `step: 0.5` no campo |
| Nova chamada (GET por id, DELETE, PUT) | exemplos no fim de [src/api.js](src/api.js) |
| IP ou porta do backend mudou | [vercel.json](vercel.json) |

Exemplo, para adicionar um campo `cargo` de escolha:

```js
{ nome: 'cargo', label: 'Cargo', tipo: 'select', opcoes: ['DEV', 'PO', 'QA'], noForm: true, naTabela: true, obrigatorio: true },
```

(e no backend, `cargo: str` em `AvaliacaoBase`, no arquivo `app/models.py`)

---

## Deploy na Vercel

1. Em [vercel.com](https://vercel.com): **Add New › Project** › importe o repositório `frontend-simulado-pf`.
2. Framework Preset: **Vite** (detecta sozinho). Build: `npm run build`. Output: `dist`.
3. Em **Environment Variables**, cadastre:

   | Nome | Valor |
   |---|---|
   | `VITE_AUTH0_DOMAIN` | ex.: `dev-xxxx.us.auth0.com` |
   | `VITE_AUTH0_CLIENT_ID` | Client ID da aplicação SPA no Auth0 |
   | `VITE_AUTH0_AUDIENCE` | `https://avaliacoes-api` (o mesmo do backend) |

4. **Deploy**. Copie a URL (`https://xxx.vercel.app`) e coloque no Auth0, na aplicação SPA:
   *Allowed Callback URLs*, *Allowed Logout URLs* e *Allowed Web Origins*.

> Mudou alguma variável na Vercel? Precisa de **Redeploy**, porque o Vite grava as variáveis no build.

### Por que `/api` e o `vercel.json`?

A Vercel serve o front em **https**, e o backend na EC2 é **http**. O navegador bloqueia chamadas
https → http ("mixed content"). Por isso o front chama `/api/avaliacoes` no próprio domínio e a
Vercel repassa, pelo servidor dela, para `http://13.220.42.157:8080/avaliacoes` ([vercel.json](vercel.json)).
De quebra, isso evita problema de CORS.

Em dev, quem faz o mesmo papel é o proxy do [vite.config.js](vite.config.js).

---

## Rodar localmente

```bash
npm install
cp .env.example .env   # preencha as variáveis do Auth0
npm run dev            # http://localhost:5173
```

No `.env`, `VITE_PROXY_TARGET` define para onde vai o `/api`:
- `http://localhost:8000`: backend rodando local
- `http://13.220.42.157:8080`: backend da AWS

## Estrutura

```
src/
  config.js              ⭐ rota, roles, campos
  api.js                 chamadas à API (listar, cadastrar + exemplos)
  App.jsx                login/logout, roles do token, layout
  components/
    Formulario.jsx       formulário gerado de CAMPOS (noForm: true)
    Lista.jsx            tabela gerada de CAMPOS (naTabela: true)
  main.jsx               Auth0Provider
  styles.css
vercel.json              proxy /api → backend na EC2
```
