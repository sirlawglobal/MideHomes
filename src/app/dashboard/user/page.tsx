"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useListingStore } from '@/store/useListingStore';
import { PropertyCard } from '@/components/PropertyCard';
import { useEffect, useState } from 'react';
import { Building2, Heart, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const { listings, fetchListings } = useListingStore();
    const [savedListings, setSavedListings] = useState<any[]>([]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    useEffect(() => {
        if (user?.savedProperties && listings.length > 0) {
            const saved = listings.filter(listing => user.savedProperties?.includes(listing.id));
            setSavedListings(saved);
        }
    }, [user, listings]);

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Widget */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Profile Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="font-semibold text-slate-900">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-semibold text-slate-900">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Account Type</p>
                                    <p className="font-semibold text-slate-900 capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Area: Wishlist */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                            My Wishlist
                        </h2>
                        <span className="text-slate-500">{savedListings.length} Properties</span>
                    </div>

                    {savedListings.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {savedListings.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center border-dashed bg-slate-50">
                            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-slate-500 mb-6">Browse our properties and save your favorites here.</p>
                            <a href="/listings" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-900 text-white hover:bg-blue-800 h-10 py-2 px-4">
                                Browse Properties
                            </a>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
