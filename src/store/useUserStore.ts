import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from './useAuthStore';

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    joined: string;
    status: 'Active' | 'Inactive';
}

interface UserState {
    users: UserEntity[];
    isLoading: boolean;
    setUsers: (users: UserEntity[]) => void;
    addUser: (user: UserEntity) => void;
    updateUser: (id: string, user: Partial<UserEntity>) => void;
    deleteUser: (id: string) => void;
}

export const MOCK_USERS: UserEntity[] = [
    { id: '1', name: 'John Admin', email: 'admin@midehomes.com', role: 'superadmin', joined: '2023-01-15', status: 'Active' },
    { id: '2', name: 'Sarah Jenkins', email: 'sarah@midehomes.com', role: 'admin', joined: '2023-03-22', status: 'Active' },
    { id: '3', name: 'David Wright', email: 'david@example.com', role: 'user', joined: '2023-06-10', status: 'Active' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'user', joined: '2023-08-05', status: 'Inactive' },
];

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            users: MOCK_USERS,
            isLoading: false,
            setUsers: (users) => set({ users }),
            addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
            updateUser: (id, updatedFields) =>
                set((state) => ({
                    users: state.users.map((u) => (u.id === id ? { ...u, ...updatedFields } : u)),
                })),
            deleteUser: (id) =>
                set((state) => ({
                    users: state.users.filter((u) => u.id !== id),
                })),
        }),
        {
            name: 'users-storage',
        }
    )
);
