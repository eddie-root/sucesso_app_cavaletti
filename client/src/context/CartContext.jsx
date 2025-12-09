import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import ProductContext from "./ProductContext";
import GlobalContext from "./GlobalContext";
import api from "../utils/api";
import { calculateItemDiscount } from "../utils/discount";

const CartContext = createContext(null);

export const CartContextProvider = ({ children }) => {

    const { products } = useContext(ProductContext);
    const { currency, navigate } = useContext(GlobalContext);

    const [cartItems, setCartItems] = useState([]);
    const [itemDiscounts, setItemDiscounts] = useState({});
    const [itemOptions, setItemOptions] = useState({});

    const handleDiscountChange = (itemId, assento, type, value) => {
        const key = `${itemId}-${assento}`;
        setItemDiscounts((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            [type]: Number(value) || 0,
          },
        }));
      };
      
      const updateItemOptions = (itemId, assento, options) => {
        const key = `${itemId}-${assento}`;
        setItemOptions(prev => ({
            ...prev,
            [key]: { ...prev[key], ...options }
        }));
    };

    const addToCart = (itemId, quantity, price, assento, priceGroupName) => {
        const product = products.find(p => p._id === itemId);
        if (!product) return;

        setCartItems(prevItems => {
            const itemIndex = prevItems.findIndex(item => item.product._id === itemId && item.assento === assento);
            if (itemIndex > -1) {
                const newItems = [...prevItems];
                newItems[itemIndex].quantity += quantity;
                return newItems;
            } else {
                const newItem = {
                    product,
                    quantity,
                    price,
                    assento,
                    priceGroupName,
                };
                return [...prevItems, newItem];
            }
        });
        toast.success(`${product.name} adicionado ao carrinho.`);
    };

    const removeFromCart = (itemId, assento) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.product._id === itemId && item.assento === assento)));
    };

    const updateQuantity = (itemId, assento, quantity) => {
        setCartItems(prevItems => {
            const itemIndex = prevItems.findIndex(item => item.product._id === itemId && item.assento === assento);
            if (itemIndex > -1) {
                const newItems = [...prevItems];
                newItems[itemIndex].quantity = quantity;
                return newItems;
            }
            return prevItems;
        });
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getDiscountedTotal = () => {
        return cartItems.reduce((total, item) => {
          if (!item.product) return total;
          const key = `${item.product._id}-${item.assento}`;
          const discounts = itemDiscounts[key] || {};
          const discountedPrice = calculateItemDiscount(
            item.price * item.quantity,
            discounts.discount1,
            discounts.discount2,
            discounts.discount3,
            discounts.discount4
          );
          return total + discountedPrice;
        }, 0);
      };

    const clearCart = () => {
        setCartItems([]);
        setItemDiscounts({}); // Also clear discounts
    };

    const createPreOrder = async (orderData) => {
        try {
            const { data } = await api.post("/api/orders/pre-order", orderData);
            if (data.success) {
                toast.success("Pré-pedido criado com sucesso!");
                clearCart();
                navigate("/my-orders");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao criar o pré-pedido.");
        }
    };

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        const storedDiscounts = localStorage.getItem('itemDiscounts');
        const storedOptions = localStorage.getItem('itemOptions');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        if (storedDiscounts) {
            setItemDiscounts(JSON.parse(storedDiscounts));
        }
        if (storedOptions) {
            setItemOptions(JSON.parse(storedOptions));
        }
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('itemDiscounts', JSON.stringify(itemDiscounts));
            localStorage.setItem('itemOptions', JSON.stringify(itemOptions));
        } else {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('itemDiscounts');
            localStorage.removeItem('itemOptions');
        }
    }, [cartItems, itemDiscounts, itemOptions]);

    const contextValue = {
        cartItems,
        itemDiscounts,
        itemOptions,
        updateItemOptions,
        handleDiscountChange,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        getDiscountedTotal,
        createPreOrder,
        clearCart,
        products,
        currency,
        navigate,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

CartContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CartContext;
