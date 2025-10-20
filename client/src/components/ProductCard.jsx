import React, { useContext } from 'react'
import GlobalContext from '../context/GlobalContext';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {

    const  { navigate }  = useContext(GlobalContext);

  return product && (
    <div onClick={()=> {navigate(`/product/${product.subcategory}`); scrollTo(0,0)}} className='border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full'>
      <div className='group cursor-pointer flex items-center justify-center px-2'>
        <img className='group-hover:scale-105 transition max-w-26 md:max-w-36' src={product.image[0]} alt={product.name} />
      </div>
      <div className='text-gray-600/90 text-md'>
        <p className='text-gray-700 font-medium text-lg truncate w-full'>{product.name}</p>
        <p>{product.newRelease ? '' : ""}</p>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductCard
