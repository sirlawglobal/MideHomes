import { create } from 'zustand';
import axios from 'axios';

export interface Category {
    id: string;
    name: string;
    description: string;
    count: number;
    status: 'Active' | 'Inactive';
}

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    addCategory: (category: Omit<Category, 'id' | 'count'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/categories');
            set({ categories: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addCategory: async (categoryData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/categories', categoryData);
            set((state) => ({ 
                categories: [response.data, ...state.categories],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateCategory: async (id, updatedFields) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`/api/categories/${id}`, updatedFields);
            set((state) => ({
                categories: state.categories.map((c) => (c.id === id ? { ...c, ...response.data } : c)),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
