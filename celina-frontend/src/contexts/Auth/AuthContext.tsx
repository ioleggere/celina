import { createContext } from "react";
import { User } from "../../types/User";

export type AuthContextType = {
    user: User| null;
    signin: (username: string, password: string) => Promise<boolean>;
    signout: () => void;
    validateToken: () => void;
    register: (user: User) => Promise<boolean>; 
}

export const AuthContext = createContext<AuthContextType>(null!);