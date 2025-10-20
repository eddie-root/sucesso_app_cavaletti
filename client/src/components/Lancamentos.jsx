import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import ProductContext from '../context/ProductContext';

const Lancamentos = () => {

  const { products } = useContext(ProductContext);
  const productLancamento = Array.from(new Map(products.filter(p => p.isNewProduct).map(item=> [item.subcategory, item])).values());

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Lançamentos</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6 mt-6 gap-3'>
        {
          productLancamento.map((product)=> {
            return (
              <Link to={`/product/${product.subcategory}`} key={product.subcategory} className='flex flex-col items-center gap-2'>
                <img src={product.image[0]} alt={product.name} className='w-28 h-30 object-cover rounded-dull' />
                <p className='text-center'>{product.name}</p>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Lancamentos
