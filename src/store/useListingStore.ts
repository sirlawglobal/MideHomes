import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    type: 'Rent' | 'Buy' | 'Short Let';
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    status: 'Active' | 'Pending' | 'Sold';
    images: string[];
    createdAt: string;
    agentId: string;
}

interface ListingState {
    listings: Listing[];
    isLoading: boolean;
    setListings: (listings: Listing[]) => void;
    addListing: (listing: Listing) => void;
    updateListing: (id: string, listing: Partial<Listing>) => void;
    deleteListing: (id: string) => void;
}

// Mock initial data
export const MOCK_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Modern Luxury Villa',
        description: 'Beautiful 4 bedroom villa with ocean views and a private pool.',
        price: 1250000,
        location: 'Beverly Hills, CA',
        type: 'Buy',
        bedrooms: 4,
        bathrooms: 3.5,
        sqft: 4200,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '2',
        title: 'Downtown Penthouse',
        description: 'Stunning penthouse in the heart of the city with panoramic skyline views.',
        price: 8500,
        location: 'New York, NY',
        type: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1800,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
    },
    {
        id: '3',
        title: 'Cozy Mountain Cabin',
        description: 'Perfect weekend getaway with a large fireplace and wrap-around deck.',
        price: 450000,
        location: 'Aspen, CO',
        type: 'Buy',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2100,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
];

export const useListingStore = create<ListingState>()(
    persist(
        (set) => ({
            listings: MOCK_LISTINGS,
            isLoading: false,
            setListings: (listings) => set({ listings }),
            addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
            updateListing: (id, updatedFields) =>
                set((state) => ({
                    listings: state.listings.map((l) => (l.id === id ? { ...l, ...updatedFields } : l)),
                })),
            deleteListing: (id) =>
                set((state) => ({
                    listings: state.listings.filter((l) => l.id !== id),
                })),
        }),
        {
            name: 'listings-storage',
        }
    )
);
