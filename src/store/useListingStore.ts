import { create } from 'zustand';
import axios from 'axios';

export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    type: 'Rent' | 'Buy' | 'Short Let';
    bedrooms?: number;
    bathrooms?: number;
    sqft: number;
    status: 'Active' | 'Pending' | 'Sold';
    images: string[];
    createdAt: string;
    agentId: string;
    agent?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

interface ListingState {
    listings: Listing[];
    isLoading: boolean;
    error: string | null;
    fetchListings: (filters?: any) => Promise<void>;
    addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
    updateListing: (id: string, listing: Partial<Listing>) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
}

export const useListingStore = create<ListingState>((set) => ({
    listings: [],
    isLoading: false,
    error: null,

    fetchListings: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/listings', { params: filters });
            set({ listings: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addListing: async (listingData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/listings', listingData);
            set((state) => ({ 
                listings: [response.data, ...state.listings],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateListing: async (id, updatedFields) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`/api/listings/${id}`, updatedFields);
            set((state) => ({
                listings: state.listings.map((l) => (l.id === id ? { ...l, ...response.data } : l)),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteListing: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/listings/${id}`);
            set((state) => ({
                listings: state.listings.filter((l) => l.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
