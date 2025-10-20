import React, { createContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const GlobalContext = createContext(null)

export const GlobalContextProvider = ({ children }) => {
    const defaultBaseUrl = axios.defaults.baseURL;
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const value = {
        navigate,
        currency,
        axios,
        defaultBaseUrl,
    }

  return (
    <GlobalContext.Provider value={value}>
      { children }
    </GlobalContext.Provider>
  )
};

GlobalContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default GlobalContext
