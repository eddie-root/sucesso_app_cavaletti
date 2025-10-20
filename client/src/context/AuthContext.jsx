import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import PropTypes from "prop-types";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children })=> {

    const [ user, setUser ] = useState(null);
    const [ isUser, setIsUser ] = useState(true);

    // Fetch Admin 

    // Fetch User from Backend
    const fetchUser = async () => {
    try {
        const { data } = await axios.get('/api/user/is-auth');
        if (data.success) {
            setUser(data.user);
        }
        } catch (error) {
            console.log(error);
            setUser(null);
        }
    };
  
    useEffect(()=> {
        fetchUser();
    },[])

    const value = {
        user, 
        setUser, 
        isUser,
        setIsUser,
        axios
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext;
