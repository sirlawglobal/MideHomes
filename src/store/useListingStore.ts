import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        title: 'Luxury 5 Bedroom Fully Detached Villa',
        description: 'Magnificent 5-bedroom villa located in the heart of Old Ikoyi. Features include a swimming pool, cinema room, fully fitted kitchen, and 2-room BQ. Built to the highest international standards.',
        price: 850000000,
        location: 'Old Ikoyi, Lagos',
        category: 'Residential',
        type: 'Buy',
        bedrooms: 5,
        bathrooms: 6,
        sqft: 6500,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '2',
        title: 'Modern 3 Bedroom Apartment',
        description: 'Contemporary 3-bedroom apartment in a serviced estate. High-speed internet, 24/7 power, and top-tier security. Perfect for young professionals.',
        price: 4500000,
        location: 'Lekki Phase 1, Lagos',
        category: 'Residential',
        type: 'Rent',
        bedrooms: 3,
        bathrooms: 3.5,
        sqft: 2200,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
    },
    {
        id: '3',
        title: 'Ocean View Penthouse',
        description: 'Luxury penthouse overlooking the Atlantic Ocean. Floor-to-ceiling windows, private elevator, and expansive terrace for entertaining.',
        price: 12000000,
        location: 'Eko Atlantic City, VI, Lagos',
        category: 'Short Let',
        type: 'Short Let',
        bedrooms: 4,
        bathrooms: 4.5,
        sqft: 3800,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '4',
        title: 'Executive 4 Bedroom Terraced House',
        description: 'Tastefully finished terrace duplex in a gated community. Features a gym, play area for kids, and ample parking space.',
        price: 120000000,
        location: 'Victoria Island, Lagos',
        category: 'Residential',
        type: 'Buy',
        bedrooms: 4,
        bathrooms: 4,
        sqft: 2800,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
    },
    {
        id: '5',
        title: 'Studio Apartment for Short Stay',
        description: 'Cozy and stylish studio apartment. Ideal for business travelers. Includes Netflix, housekeeping, and gym access.',
        price: 65000,
        location: 'Oniru, VI, Lagos',
        category: 'Short Let',
        type: 'Short Let',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 650,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1536376074432-8d4a34aa2f8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '6',
        title: 'Prime Land in Gated Estate',
        description: '600sqm dry land with C of O. Ready for immediate development. Located in a high-brow residential area.',
        price: 85000000,
        location: 'Ikeja GRA, Lagos',
        category: 'Land',
        type: 'Buy',
        sqft: 6458,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
    },
    {
        id: '7',
        title: '4 Bedroom Semi-Detached Duplex',
        description: 'Brand new semi-detached house with modern finishes and smart home features. Located in a secured neighborhood.',
        price: 95000000,
        location: 'Chevron, Lekki, Lagos',
        category: 'Residential',
        type: 'Buy',
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3200,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '8',
        title: 'Luxury 2 Bedroom Flat',
        description: 'Executive 2-bedroom flat with all rooms ensuite. Spacious living area and fully fitted kitchen in a serene environment.',
        price: 3500000,
        location: 'Gbagada Phase 2, Lagos',
        category: 'Residential',
        type: 'Rent',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1500,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
    },
    {
        id: '9',
        title: 'Waterfront 5 Bedroom Mansion',
        description: 'Stunning waterfront property with private jetty. Exceptional luxury living with private boat club membership.',
        price: 1500000000,
        location: 'Banana Island, Lagos',
        category: 'Residential',
        type: 'Buy',
        bedrooms: 5,
        bathrooms: 7,
        sqft: 8000,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '1',
    },
    {
        id: '10',
        title: 'Modern 4 Bedroom Townhouse',
        description: 'New build townhouse with rooftop terrace and panoramic city views. Situated in a premium urban development.',
        price: 150000000,
        location: 'Maryland, Ikeja, Lagos',
        category: 'Residential',
        type: 'Buy',
        bedrooms: 4,
        bathrooms: 4.5,
        sqft: 3500,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        createdAt: new Date().toISOString(),
        agentId: '2',
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
