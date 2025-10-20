import React, { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { isUser } = useContext(AuthContext);

    useEffect(()=> {
        if (!isUser) {
            toast.error('Acesso negado. Você precisa ser um administrador.');
        }
    }, [isUser]);

    if (!isUser) {
        return <Navigate to='/' />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ProtectedRoute
