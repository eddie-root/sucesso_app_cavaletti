import React, { useContext, useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import GlobalContext from '../context/GlobalContext';
import ProductContext from '../context/ProductContext';

const CollectionList = () => {

    const { navigate } = useContext(GlobalContext);
    const { products } = useContext(ProductContext);
    const [ filterProducts, setFilterProducts ] = useState([]);
    const [ category, setCategory ] = useState([])

    const toggleCategory = (e)=> {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = ()=> {
        let productCopy = products;

        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category))
        }

        const uniqueProducts = productCopy.filter((product, index, self)=> 
            index === self.findIndex((p)=> p.subcategory === product.subcategory)
        )
        setFilterProducts(uniqueProducts);
    }

    useEffect(()=> {
        applyFilter();
    }, [products, category])

  return (
      <div className='flex '>
      <div className='flex flex-col sm:flex-row md:flex-row gap-1 sm:gap-10 pt-10 border-t'>
        {/* ================== FILTER OPTIONS ===============*/}
        <div className='min-w-60'>
            <div className={`border border-gray-300 pl-5 py-3 mt-6 sm:black`}>
                <p className='mb-3 text-md font-medium'>CATEGORIAS</p>
                <div>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Coletivas'} onChange={toggleCategory}/> Coletivas
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Colaborativas'} onChange={toggleCategory}/> Colaborativas
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Diretivas'} onChange={toggleCategory}/> Diretivas
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Operativas'} onChange={toggleCategory}/> Operativas
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Gamer'} onChange={toggleCategory}/> Gamer
                    </p>
                   
                </div>
            </div>
        </div>

        {/* ================== RIGHT SIDE ===============*/}
        <div className='flex-1'>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                {
                    filterProducts.map((product, index)=> (
                        <div onClick={()=> navigate(`/product/${product.subcategory}`)} key={index} >
                            <ProductCard product={product} />
                        </div>
                    ))
                }            
            </div>
        </div>
    </div>
    </div>
  )
}

export default CollectionList
