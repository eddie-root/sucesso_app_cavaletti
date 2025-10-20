import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductContext from '../context/ProductContext'
import GlobalContext from '../context/GlobalContext'

const Product = () => {
  const { products } = useContext(ProductContext)
  const { navigate } = useContext(GlobalContext)
  const { productId } = useParams()
  const [ filterProd, setFilterProd ] = useState([])
  const [ searchTerm, setSearchTerm ] = useState('')

  const applyProductFilter = () => {
    let productCopy = products

    if (searchTerm) {
      productCopy = productCopy.filter(item=> item.codp.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (productId) {
      setFilterProd(productCopy.filter(item=> item.subcategory === productId))
    } else {
      setFilterProd(productCopy)
    }
  }

  useEffect(()=> {
    applyProductFilter()
  }, [products, productId, searchTerm])

  
  return (
    <div  className='max-w-6xl mx-auto mt-4 px-4'>
        <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-medium'>Selecionar Produtos</h2>
            <button
               onClick={()=> navigate('/collection')}
               className='text-gray-600 hover:text-gray-700' 
            >
                Voltar ao Colleção
            </button>
       </div>

      {/* Search Input */}
      <div className='mb-4'>
            <input
               type='text'
               placeholder='Buscar pelo Código...'
               className='p-2 border border-gray-400 rounded w-full'
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
       </div>

      {
        filterProd.map((item, index)=> (
          <div onClick={()=> navigate(`/product/${item.name}/${item.codp}`)} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr] gap-3 items-start border-2 border-gray-400 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 cursor-pointer' key={index}>
            <img className='ml-4 mt-3 w-16' src={item.image} alt="" />
            <div>
              <p className='mt-3 font-large text-[24px]'>{item.name}</p>
              <p className='text-gray-700/80 mb-2 mt-6 text-sm sm:text-[15px]' >{item.category}</p>
              <p className='text-sm sm:text-[15px]'>{item.description}</p>
            </div>
            <p className='ml-4 mt-3 text-sm sm:text-[16px]'>{item.codp}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Product
