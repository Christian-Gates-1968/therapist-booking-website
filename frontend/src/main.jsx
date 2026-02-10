import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import ThemeContextProvider from './context/ThemeContext.jsx'
import { ChatbotContextProvider } from './context/ChatbotContext.jsx'
import CartContextProvider from './context/CartContext.jsx'




createRoot(document.getElementById('root')).render(
  <BrowserRouter>  
    <AppContextProvider>
      <ThemeContextProvider>
        <ChatbotContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </ChatbotContextProvider>
      </ThemeContextProvider>
    </AppContextProvider>
  </BrowserRouter>
)