import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/globals.css'
import './i18n'
import { App } from './App'

const rootElement = document.getElementById('root')

const renderRoot = () => {
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('preview') === 'mascot'
  ) {
    const PreviewSheet = lazy(() => import('./mascot/preview'))
    return (
      <Suspense fallback={null}>
        <PreviewSheet />
      </Suspense>
    )
  }
  return <App />
}

if (rootElement) {
  createRoot(rootElement).render(<StrictMode>{renderRoot()}</StrictMode>)
}
