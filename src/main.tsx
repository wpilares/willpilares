import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/globals.css'
import './i18n'
import { App } from './App'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
