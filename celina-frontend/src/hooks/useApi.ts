import axios from 'axios'
import { User } from '../types/User';

const api = axios.create({
    baseURL: import.meta.env.VITE_FACE_AUTH_API
});


export const useApi = () => ({

    validateToken: async (token: string) => {
        const user = {
            username: "teste",
            email: "teste"
        }
        const data = {
            user: user
        }
        return data;
    },
    signin: async (username: string, password: string) => {
        const data = {
            access_token: "123456"
        }
        return data;
    },
    signintoken: async (token: string) => {
        const data = {
            token: token
        }
        return data;
    },
    signout: () => {
        return { status: true }
    },
    register: async (user: User) => {
        const params = new URLSearchParams();
        params.append('username', user.username)
        params.append('password', user.password)
        params.append('email', user.email)
        const response = await api.post('/face-auth/register_face', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response;
    }
})