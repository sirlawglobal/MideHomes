import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    updateCategory: (id: string, category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
}

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Residential', description: 'Homes, apartments, and condos', count: 145, status: 'Active' },
    { id: '2', name: 'Commercial', description: 'Office spaces, retail, and warehouses', count: 32, status: 'Active' },
    { id: '3', name: 'Land', description: 'Empty plots and agricultural land', count: 18, status: 'Active' },
    { id: '4', name: 'Short Let', description: 'Vacation homes and short-term rentals', count: 89, status: 'Active' },
];

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            categories: MOCK_CATEGORIES,
            isLoading: false,
            setCategories: (categories) => set({ categories }),
            addCategory: (category) => set((state) => ({ categories: [category, ...state.categories] })),
            updateCategory: (id, updatedFields) =>
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
                })),
            deleteCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id),
                })),
        }),
        {
            name: 'categories-storage',
        }
    )
);
