import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './store/AuthProvider.jsx'
import ThemeProvider from './store/ThemeProvider.jsx'
import { BoardsProvider } from './store/BoardProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BoardsProvider>
          <App />
        </BoardsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
