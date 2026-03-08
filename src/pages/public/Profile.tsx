import { useAuthStore } from '../../store/useAuthStore';
import { useListingStore } from '../../store/useListingStore';
import { PropertyCard } from '../../components/PropertyCard';
import { User, Mail, Shield, Heart } from 'lucide-react';

export function Profile() {
    const { user } = useAuthStore();
    const { listings } = useListingStore();

    if (!user) return null;

    const savedProperties = listings.filter(l => user.savedProperties?.includes(l.id));

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500 flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-24">
                        <div className="flex flex-col items-center">
                            <div className="h-28 w-28 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border-4 border-white shadow-md">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-600 capitalize mb-6">
                                <Shield className="h-3.5 w-3.5" /> {user.role || 'User'}
                            </span>

                            <div className="w-full space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="p-2 bg-slate-50 rounded-lg"><Mail className="h-4 w-4 text-slate-400" /></div>
                                    <span className="text-sm">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Properties Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900">Saved Properties</h2>
                            <span className="bg-blue-50 text-blue-600 py-1 px-3 rounded-full text-sm font-semibold">
                                {savedProperties.length} Saved
                            </span>
                        </div>

                        {savedProperties.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center justify-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No saved properties</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    You haven't saved any properties yet. Browse our listings and click the heart icon to save your favorites here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedProperties.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
