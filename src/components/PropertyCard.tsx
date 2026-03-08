import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { BedDouble, Bath, Square, MapPin, Heart } from 'lucide-react';
import type { Listing } from '../store/useListingStore';
import { useAuthStore } from '../store/useAuthStore';

interface PropertyCardProps {
    property: Listing;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const { user, isAuthenticated, toggleSavedProperty } = useAuthStore();
    const navigate = useNavigate();

    const isSaved = user?.savedProperties?.includes(property.id) || false;

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        toggleSavedProperty(property.id);
    };

    return (
        <Card className="overflow-hidden group cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                    alt={property.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-blue-600 hover:bg-blue-700 uppercase tracking-wider text-[10px] font-bold">
                        For {property.type}
                    </Badge>
                    <Badge variant={property.status === 'Active' ? 'default' : 'secondary'} className="uppercase tracking-wider text-[10px] font-bold">
                        {property.status}
                    </Badge>
                </div>
                <button
                    onClick={handleSave}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors z-10"
                >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
                </button>
            </div>

            <CardContent className="p-5">
                <h3 className="font-bold text-xl text-slate-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    <Link to={`/properties/${property.id}`} className="after:absolute after:inset-0">
                        {property.title}
                    </Link>
                </h3>
                <p className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                    <span className="truncate">{property.location}</span>
                </p>

                <div className="flex items-center justify-between text-sm text-slate-600 border-b pb-4 mb-4">
                    <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{property.sqft} sqft</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
                <div>
                    <span className="text-2xl font-bold text-blue-900">
                        ${property.price.toLocaleString()}
                    </span>
                    {property.type === 'Rent' && <span className="text-slate-500 text-sm font-medium">/mo</span>}
                </div>
            </CardFooter>
        </Card>
    );
}
