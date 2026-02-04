import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './components/auth/AuthContext'
import { PusherProvider } from './contexts/PusherContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Router basename="/">
        <AuthProvider>
          <PusherProvider>
            <App />
          </PusherProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  </StrictMode>,
)
