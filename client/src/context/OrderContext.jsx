import React, { createContext, useState, useContext } from 'react';
import AuthContext from './AuthContext'; // Import AuthContext to get axios
import PropTypes from "prop-types";


const OrderContext = createContext();


export const OrderContextProvider = ({ children }) => {
    const { axios } = useContext(AuthContext); // Get axios from AuthContext
    // State for the list of all orders
    const [orders, setOrders] = useState([]);
    
    // State for the order currently being built
    const [preOrder, setPreOrder] = useState({
        client: null,
        items: [],
        transportadora: '',
        prazo: '',
        totalAmount: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to update the order being built
    const updatePreOrder = (data) => {
        setPreOrder(prev => ({ ...prev, ...data }));
    };

    // Function to finalize the pre-order and save it
    const finalizePreOrder = async (orderData) => {
        try {
            setLoading(true);
            setError(null);
            // No need for { withCredentials: true } as it's default in AuthContext's axios
            const response = await axios.post('/api/order/pre-order', orderData);
            if (response.data.success) {
                // Add the new order to the list of orders
                setOrders(prevOrders => [...prevOrders, response.data.order]);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Falha ao finalizar o pedido.';
            setError(errorMessage);
            console.error('Error finalizing order:', err);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Function to remove an order
    const removeOrder = async (orderId) => {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/api/order/${orderId}`);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (err) {
            setError('Falha ao remover o pedido.');
            console.error('Error deleting order:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to save/duplicate an order
    const saveOrder = async (order) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/order/pre-order', order);
            if (response.data.success) {
                // Add the new order to the list
                setOrders(prevOrders => [...prevOrders, response.data.order]);
            }
        } catch (err) {
            setError('Falha ao salvar o pedido.');
            console.error('Error saving order:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const value = {
        orders,
        setOrders,
        preOrder,
        updatePreOrder,
        finalizePreOrder,
        removeOrder,
        saveOrder,
        loading,
        error,
    
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

OrderContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default OrderContext;