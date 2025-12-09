import React, { useContext } from 'react'
import { toast } from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import UIContext from '../context/UIContext';
import GlobalContext from '../context/GlobalContext';
import api from '../utils/api';

const Login = () => {
    const {  setUser } = useContext(AuthContext);
    const {  setShowUserLogin } = useContext(UIContext);
    const {  navigate } = useContext(GlobalContext);

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await api.post(`/api/user/${state}`, { name, email, password })

            // setShowUserLogin(false)
            if (data.success) {
                setShowUserLogin(false)
                setUser(data.user)
                navigate('/')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao processar requisição');
        }
    }

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Usuário</span> {state === "login" ? "Login" : "Cadastro"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Nome</p>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="Digite seu nome" 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                            type="text" 
                            required 
                        />
                    </div>
                )}
                <div className="w-full">
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="Digite seu email" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="email" 
                        required 
                    />
                </div>
                <div className="w-full">
                    <p>Senha</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="Digite sua senha" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="password" 
                        required 
                    />
                </div>
                {state === "register" ? (
                    <p>
                        Já tem uma conta? <span onClick={() => setState("login")} className="text-primary cursor-pointer">Clique aqui</span>
                    </p>
                ) : (
                    <p>
                        Criar uma conta? <span onClick={() => setState("register")} className="text-primary cursor-pointer">Clique aqui</span>
                    </p>
                )}
                <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Criar conta" : "Fazer login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
