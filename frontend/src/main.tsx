import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--obsidian-700)',
            color: 'var(--slate-100)',
            border: '1px solid var(--obsidian-border)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
