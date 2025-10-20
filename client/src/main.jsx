// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { GlobalContextProvider } from './context/GlobalContext.jsx'
import { ProductContextProvider } from './context/ProductContext.jsx'
import { UIContextProvider } from './context/UIContext.jsx'
import { CartContextProvider } from './context/CartContext.jsx';
import { OrderContextProvider } from './context/OrderContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
            <UIContextProvider>
              <CartContextProvider>
                <OrderContextProvider>
                  <App />
                </OrderContextProvider>
              </CartContextProvider>
            </UIContextProvider>          
        </ProductContextProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  </BrowserRouter>,
)
