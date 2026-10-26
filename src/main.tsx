import { MotionProvider } from '@components'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/globals.css'
import './i18n'
import { App } from './App'

const rootElement = document.getElementById('root')

const loadPreview = (preview: string | null) => {
  if (preview === 'mascot') return lazy(() => import('./mascot/preview'))
  if (preview === 'backdrops') return lazy(() => import('./backdrops/preview'))
  return null
}

const renderRoot = () => {
  const PreviewSheet = import.meta.env.DEV
    ? loadPreview(new URLSearchParams(window.location.search).get('preview'))
    : null
  if (PreviewSheet) {
    return (
      <Suspense fallback={null}>
        <PreviewSheet />
      </Suspense>
    )
  }
  return (
    <MotionProvider>
      <App />
    </MotionProvider>
  )
}

if (rootElement) {
  createRoot(rootElement).render(<StrictMode>{renderRoot()}</StrictMode>)
}
