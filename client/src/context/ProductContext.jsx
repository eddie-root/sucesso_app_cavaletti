import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import GlobalContext from './GlobalContext';

const ProductContext = createContext(null);

export const ProductContextProvider = ({ children }) => {
    const { axios } = useContext(GlobalContext);
    const [ products, setProducts ] = useState([]);

    const fetchProducts = async ()=> {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(()=> {
        fetchProducts();
    },[])

    const value = {
        products,
    };

  return (
    <ProductContext.Provider value={value}>
      { children }
    </ProductContext.Provider>
  )
}

ProductContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProductContext;
