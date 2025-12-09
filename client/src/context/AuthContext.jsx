import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiUrl from '../utils/api';


const AuthContext = createContext(null);

export const AuthContextProvider = ({ children })=> {

    const [ user, setUser ] = useState(null);
    const [ isUser, setIsUser ] = useState(true);

    // Fetch User from Backend
    const fetchUser = async () => {
        try {
            const { data } = await apiUrl.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.log(error);
            setUser(null);
        }
    };

    const logout = ()=> {
        setUser(null);
        localStorage.removeItem('user');
    }
  
    useEffect(()=> {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            fetchUser();            
        }
    },[])

    const value = {
        user, 
        setUser, 
        isUser,
        setIsUser,
        logout,
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
