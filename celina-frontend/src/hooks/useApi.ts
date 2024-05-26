import axios from 'axios'
import { User } from '../types/User';

const api = axios.create({
    baseURL: import.meta.env.VITE_CELINA_API
});

export const useApi = () => ({

    validateToken: async (token: string) => {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
        try {
            const response = await api.get('/protected', config);
            return response.data;
        } catch (error) {
            throw new Error('Invalid token');
        }
    },
    signin: async (username: string, password: string) => {
        try {
            const response = await api.post('/login', {
                username,
                password
            });
            return response.data.access_token;
        } catch (error) {
            throw new Error('Invalid username or password');
        }
    },
    signout: () => {
        return { status: true }
    },
    register: async (user: User) => {
        try {
            const response = await api.post('/register', {
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password
            });
            return response.data;
        } catch (error) {
            throw new Error('Username or email already exists');
        }
    },
    addLevel: async (name: string, matrix: number[][]) => {
        try {
            const response = await api.post('/add_level', {
                name: name,
                matrix: matrix
            });
            return response.data;
        } catch (error) {
            throw new Error('error adding level' + error);
        }
    },
    getLevel: async (level_id: number) => {
        try {
            const response = await api.get('/get_level/'+level_id);
            return response.data;
        } catch (error) {
            throw new Error('Username or email already exists');
        }
    },
    getLevels: async () => {
        try {
            const response = await api.get('/get_levels');
            return response.data;
        } catch (error) {
            throw new Error('Username or email already exists');
        }
    }
})