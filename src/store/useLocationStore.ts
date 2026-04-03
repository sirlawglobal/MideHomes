import { create } from 'zustand';
import axios from 'axios';

export interface Location {
    id: string;
    city: string;
    state: string;
    properties: number;
    status: 'Active' | 'Inactive';
}

interface LocationState {
    locations: Location[];
    isLoading: boolean;
    error: string | null;
    fetchLocations: () => Promise<void>;
    addLocation: (location: Omit<Location, 'id' | 'properties'>) => Promise<void>;
    updateLocation: (id: string, location: Partial<Location>) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
    locations: [],
    isLoading: false,
    error: null,

    fetchLocations: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/locations');
            set({ locations: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addLocation: async (locationData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/locations', locationData);
            set((state) => ({ 
                locations: [response.data, ...state.locations],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateLocation: async (id, updatedFields) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`/api/locations/${id}`, updatedFields);
            set((state) => ({
                locations: state.locations.map((l) => (l.id === id ? { ...l, ...response.data } : l)),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteLocation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/locations/${id}`);
            set((state) => ({
                locations: state.locations.filter((l) => l.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
