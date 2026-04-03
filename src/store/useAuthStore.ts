import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export type Role = 'user' | 'admin' | 'superadmin' | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    savedProperties?: string[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    toggleSavedProperty: (propertyId: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post('/api/auth/login', credentials);
                    set({
                        user: { ...response.data, savedProperties: response.data.savedProperties || [] },
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({ 
                        error: error.response?.data?.error || 'Login failed', 
                        isLoading: false 
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post('/api/auth/register', userData);
                    set({
                        user: { ...response.data, savedProperties: [] },
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({ 
                        error: error.response?.data?.error || 'Registration failed', 
                        isLoading: false 
                    });
                    throw error;
                }
            },

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                }),

            toggleSavedProperty: (propertyId) =>
                set((state) => {
                    if (!state.user) return state;
                    const currentSaved = state.user.savedProperties || [];
                    const isSaved = currentSaved.includes(propertyId);

                    return {
                        user: {
                            ...state.user,
                            savedProperties: isSaved
                                ? currentSaved.filter(id => id !== propertyId)
                                : [...currentSaved, propertyId]
                        }
                    };
                }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
