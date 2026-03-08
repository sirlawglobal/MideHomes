import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    login: (userData: User) => void;
    logout: () => void;
    toggleSavedProperty: (propertyId: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: (userData) =>
                set({
                    user: { ...userData, savedProperties: userData.savedProperties || [] },
                    isAuthenticated: true,
                    isLoading: false,
                }),
            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
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
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
);
