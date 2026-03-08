import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    setLocations: (locations: Location[]) => void;
    addLocation: (location: Location) => void;
    updateLocation: (id: string, location: Partial<Location>) => void;
    deleteLocation: (id: string) => void;
}

export const MOCK_LOCATIONS: Location[] = [
    { id: '1', city: 'Beverly Hills', state: 'California', properties: 45, status: 'Active' },
    { id: '2', city: 'New York', state: 'New York', properties: 128, status: 'Active' },
    { id: '3', city: 'Miami', state: 'Florida', properties: 67, status: 'Active' },
    { id: '4', city: 'Austin', state: 'Texas', properties: 34, status: 'Active' },
    { id: '5', city: 'Chicago', state: 'Illinois', properties: 52, status: 'Active' },
];

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            locations: MOCK_LOCATIONS,
            isLoading: false,
            setLocations: (locations) => set({ locations }),
            addLocation: (location) => set((state) => ({ locations: [location, ...state.locations] })),
            updateLocation: (id, updatedFields) =>
                set((state) => ({
                    locations: state.locations.map((l) => (l.id === id ? { ...l, ...updatedFields } : l)),
                })),
            deleteLocation: (id) =>
                set((state) => ({
                    locations: state.locations.filter((l) => l.id !== id),
                })),
        }),
        {
            name: 'locations-storage',
        }
    )
);
