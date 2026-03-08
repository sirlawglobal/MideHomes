import { useState } from 'react';
import { useListingStore } from '../../store/useListingStore';
import { PropertyCard } from '../../components/PropertyCard';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';

export function Listings() {
    const { listings } = useListingStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Basic filtering
    const filteredListings = listings.filter((listing) => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || listing.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || listing.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const FilterContent = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Search Location or Title</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        placeholder="New York, NY"
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter as any}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Buy">Buy</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Short Let">Short Let</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter as any}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="pt-4 border-t">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        setSearchTerm('');
                        setTypeFilter('All');
                        setStatusFilter('All');
                    }}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4">

                {/* Header & Mobile Filter Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Properties for You</h1>
                        <p className="text-slate-500 mt-1">Showing {filteredListings.length} results</p>
                    </div>

                    <Sheet>
                        <SheetTrigger render={<Button variant="outline" className="md:hidden flex items-center gap-2" />}>
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader className="mb-6">
                                <SheetTitle>Filters</SheetTitle>
                                <SheetDescription>Refine your property search.</SheetDescription>
                            </SheetHeader>
                            <FilterContent />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Desktop Filters Sidebar */}
                    <div className="hidden md:block w-72 shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                                Refine Search
                            </h2>
                            <FilterContent />
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        {filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredListings.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    We couldn't find any properties matching your current filters. Try adjusting your search criteria.
                                </p>
                                <Button
                                    className="mt-6"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setTypeFilter('All');
                                        setStatusFilter('All');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
