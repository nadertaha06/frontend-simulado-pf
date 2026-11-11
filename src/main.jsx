import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './styles.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

function FaltaConfig() {
  return (
    <main className="centro">
      <div className="cartao entrar">
        <h1>Falta configurar o Auth0</h1>
        <p>
          Crie o arquivo <code>.env</code> (local) ou as Environment Variables (Vercel) com{' '}
          <code>VITE_AUTH0_DOMAIN</code>, <code>VITE_AUTH0_CLIENT_ID</code> e{' '}
          <code>VITE_AUTH0_AUDIENCE</code>.
        </p>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {domain && clientId && audience ? (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience, // sem isso o token não vale para a API
        }}
        cacheLocation="localstorage" // mantém o login ao recarregar a página
      >
        <App />
      </Auth0Provider>
    ) : (
      <FaltaConfig />
    )}
  </StrictMode>,
)
