import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useApi } from "../../hooks/useApi";
import { User } from "../../types/User"
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);
    const api = useApi();

    useEffect(() => {
        validateToken();
    }, []);
    const validateToken = async () => {
        const localData = localStorage.getItem('authToken');
        if (localData) {
            const data = await api.validateToken(localData);
            const user = {
                username: data.user.username,
                email: data.user.email,
                password: ""
            }
            setUser(user)
        }
    }
    const signin = async (username: string, password: string) => {
        try {
            const data = await api.signin(username, password);
            if (data) {
                setToken(data.access_token)
                console.log(data)
                await validateToken();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error when logging in:', error);
            return false;
        }
    }

    const signintoken = async (token: string) => {
        try {
            const data = await api.signintoken(token);
            if (data) {
                setToken(data.token)
                console.log(data)
                await validateToken();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error when logging in:', error);
            return false;
        }
    }


    const signout = () => {
        api.signout();
        setUser(null);
        setToken('');
    }

    const register = async (user: User) => {
        try {
            const data = await api.register(user);
            if (data) {
                console.log(data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error when register:', error);
            return false;
        }
    }
    const setToken = (token: string) => {
        localStorage.setItem('authToken', token);
    }

    return (
        <AuthContext.Provider value={{ user, signin, signintoken, signout, validateToken, register }}>
            {children}
        </AuthContext.Provider>
    )
}