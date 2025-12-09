import { Toaster } from "react-hot-toast"
import { useContext } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import UIContext from "./context/UIContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import CollectionList from "./pages/CollectionList"
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import CreatePreOrder from "./pages/CreatePreOrder"
import MyOrder from "./pages/MyOrder"
import AdminLayout from "./pages/Admin/AdminLayout"
import AddProduct from "./pages/Admin/AddProduct"
import AddClient from './pages/Admin/AddClient'
import ListClient from './pages/Admin/ListClient'
import EditClient from './pages/Admin/EditClient'
import ListOrder from './pages/Admin/ListOrder'
import OrderDetail from './pages/Admin/OrderDetail'
import ListProduct from "./pages/Admin/ListProduct"
import EditProduct from "./pages/Admin/EditProduct"

const App = () => {

  const isUserPath = useLocation().pathname.includes('admin');
  const { showUserLogin } = useContext(UIContext);

  return (
    <div className='min-h-screen text-deafault text-gray-700 bg-white'>

     {isUserPath ? null : <Navbar />}
     { showUserLogin ? <Login /> : null}
    
      <Toaster />
      
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path="/collection" element={<CollectionList />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/product/:productId/:codp" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pre-order" element={<CreatePreOrder />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute> } >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ListProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path='add-client' element={<AddClient />} />
            <Route path='list-client' element={<ListClient />} />
            <Route path='edit-client/:id' element={<EditClient />} />
            <Route path='list-orders' element={<ListOrder />} />
            <Route path='orders/:id' element={<OrderDetail />} />
          </Route>
        </Routes>
          
      </div>

      {!isUserPath && <Footer />}
    </div>
  )
}

export default App
