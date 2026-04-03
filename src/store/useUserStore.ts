import { create } from 'zustand';
import axios from 'axios';
import type { Role } from './useAuthStore';

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    joined?: string;
    createdAt?: string;
    status: 'Active' | 'Inactive';
}

interface UserState {
    users: UserEntity[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    addUser: (user: Omit<UserEntity, 'id' | 'createdAt'>) => Promise<void>;
    updateUser: (id: string, user: Partial<UserEntity>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/users');
            set({ users: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/users', userData);
            set((state) => ({ 
                users: [response.data, ...state.users],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateUser: async (id, updatedFields) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`/api/users/${id}`, updatedFields);
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? { ...u, ...response.data } : u)),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/users/${id}`);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
