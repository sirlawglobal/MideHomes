"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useListingStore } from '@/store/useListingStore';
import { PropertyCard } from '@/components/PropertyCard';
import { useEffect, useState } from 'react';
import { Building2, Plus, MessageSquare, Briefcase, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AgentDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const { listings, fetchListings } = useListingStore();
    const [myListings, setMyListings] = useState<any[]>([]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    useEffect(() => {
        if (user && listings.length > 0) {
            // Filter listings where agentId matches user.id
            const owned = listings.filter(listing => listing.agentId === user.id);
            setMyListings(owned);
        }
    }, [user, listings]);

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Agent Portal</h1>
                    <p className="text-slate-500 mt-2">Manage your listings, client inquiries, and performance.</p>
                </div>
                <Button className="bg-sky-600 hover:bg-sky-700">
                    <Plus className="h-4 w-4 mr-2" />
                    List a Property
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="border-sky-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="h-20 w-20 bg-sky-100 text-sky-900 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                                {user?.name?.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 text-center">{user?.name}</h3>
                            <p className="text-sm text-sky-600 font-medium text-center mb-6">Licensed Real Estate Agent</p>
                            
                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start">
                                    <Briefcase className="h-4 w-4 mr-2" /> My Listings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-500 relative">
                                    <MessageSquare className="h-4 w-4 mr-2" /> Messages
                                    <span className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-red-500"></span>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-500">
                                    <Settings className="h-4 w-4 mr-2" /> Account Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Area: Listings */}
                <div className="md:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Properties Under Management</h2>
                        <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-sky-200">
                            {myListings.length} Active Listings
                        </span>
                    </div>

                    {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myListings.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center border-dashed bg-slate-50">
                            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No active listings</h3>
                            <p className="text-slate-500 mb-6">You don't have any properties currently assigned to you or listed.</p>
                            <Button className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Listing
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
