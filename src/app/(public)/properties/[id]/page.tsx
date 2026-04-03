"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useListingStore } from '@/store/useListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, BedDouble, Bath, Square, Calendar, Heart, Share2, Mail, Phone, ArrowLeft, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function PropertyDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const { fetchListings, listings } = useListingStore();
    const { user, isAuthenticated, toggleSavedProperty } = useAuthStore();
    const router = useRouter();

    const [property, setProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    const [msgName, setMsgName] = useState(user?.name || '');
    const [msgEmail, setMsgEmail] = useState(user?.email || '');
    const [msgPhone, setMsgPhone] = useState('');
    const [msgContent, setMsgContent] = useState('');

    useEffect(() => {
        const loadProperty = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/listings/${id}`);
                setProperty(response.data);
            } catch (error) {
                console.error('Error loading property:', error);
                toast.error('Failed to load property details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadProperty();
        }
    }, [id]);

    const isSaved = property && user?.savedProperties?.includes(property.id);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await axios.post('/api/messages', {
                listingId: property.id,
                agentId: property.agentId,
                senderName: msgName,
                senderEmail: msgEmail,
                senderPhone: msgPhone,
                message: msgContent,
            });
            toast.success('Message sent to agent');
            setIsMessageOpen(false);
            setMsgContent('');
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
                    <p className="text-slate-500 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
                    <Link href="/listings">
                        <Button>Back to Listings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Upper Action Bar */}
            <div className="bg-white border-b py-4 sticky top-16 z-40">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/listings">
                        <Button variant="ghost" size="sm" className="text-slate-500 flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to search
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    router.push(`/login?callbackUrl=/properties/${id}`);
                                } else if (property) {
                                    toggleSavedProperty(property.id);
                                }
                            }}
                        >
                            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="rounded-2xl overflow-hidden shadow-sm border bg-white flex flex-col items-center justify-center p-2">
                            <img
                                src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                                alt={property.title}
                                className="w-full max-h-[500px] object-cover rounded-xl"
                            />
                        </div>

                        {/* Header Info */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <Badge className="bg-blue-600 uppercase tracking-wider text-xs font-bold">
                                            For {property.type}
                                        </Badge>
                                        <Badge variant={property.status === 'Active' ? 'default' : 'secondary'} className="uppercase tracking-wider text-xs font-bold">
                                            {property.status}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
                                    <p className="flex items-center text-slate-500 text-lg">
                                        <MapPin className="h-5 w-5 mr-1 text-slate-400 shrink-0" />
                                        {property.location}
                                    </p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-4xl font-bold text-blue-900 mb-1">
                                        ${property.price.toLocaleString()}
                                    </div>
                                    {property.type === 'Rent' && <div className="text-slate-500">per month</div>}
                                </div>
                            </div>

                            {/* Mobile Price */}
                            <div className="md:hidden mt-4 pb-4 border-b">
                                <div className="text-3xl font-bold text-blue-900">
                                    ${property.price.toLocaleString()}
                                    {property.type === 'Rent' && <span className="text-slate-500 text-base font-normal">/mo</span>}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y my-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><BedDouble className="h-6 w-6" /></div>
                                    <div><p className="text-2xl font-bold text-slate-900">{property.bedrooms}</p><p className="text-sm text-slate-500">Bedrooms</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><Bath className="h-6 w-6" /></div>
                                    <div><p className="text-2xl font-bold text-slate-900">{property.bathrooms}</p><p className="text-sm text-slate-500">Bathrooms</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Square className="h-6 w-6" /></div>
                                    <div><p className="text-2xl font-bold text-slate-900">{property.sqft}</p><p className="text-sm text-slate-500">Square Feet</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Calendar className="h-6 w-6" /></div>
                                    <div><p className="text-xl font-bold text-slate-900">{new Date(property.createdAt).getFullYear()}</p><p className="text-sm text-slate-500">Built</p></div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
                                <div className="text-slate-600 text-lg leading-relaxed space-y-4">
                                    <p>{property.description}</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mt-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Features & Amenities</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Air Conditioning', 'Swimming Pool', 'Central Heating', 'Laundry Room', 'Gym', 'Alarm', 'Window Coverings', 'WiFi'].map((feat) => (
                                        <div key={feat} className="flex items-center gap-2 text-slate-600">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Contact Card */}
                            <Card className="shadow-lg border-none">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Agent</h3>

                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                        <img
                                            src={property.agent?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                                            alt="Agent"
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{property.agent?.name || 'Agent'}</h4>
                                            <p className="text-sm text-emerald-600 font-medium">Verified Agent</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button className="w-full bg-blue-900 hover:bg-blue-800" size="lg">
                                            <Phone className="h-4 w-4 mr-2" /> (555) 123-4567
                                        </Button>

                                        <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full" size="lg">
                                                    <Mail className="h-4 w-4 mr-2" /> Request Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Contact Agent</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSendMessage} className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Name</Label>
                                                        <Input id="name" required value={msgName} onChange={(e) => setMsgName(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input id="email" type="email" required value={msgEmail} onChange={(e) => setMsgEmail(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone (Optional)</Label>
                                                        <Input id="phone" type="tel" value={msgPhone} onChange={(e) => setMsgPhone(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="message">Message</Label>
                                                        <Textarea
                                                            id="message"
                                                            required
                                                            value={msgContent}
                                                            onChange={(e) => setMsgContent(e.target.value)}
                                                            className="min-h-[100px]"
                                                            placeholder={`I am interested in ${property.title}...`}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end pt-4">
                                                        <Button type="submit" disabled={isSending} className="bg-blue-900 hover:bg-blue-800">
                                                            {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                                            {isSending ? 'Sending...' : 'Send Message'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Placeholder */}
                            <Card className="overflow-hidden">
                                <div className="h-64 bg-slate-200 flex items-center justify-center relative">
                                    <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lagos,Nigeria&zoom=14&size=600x300&sensor=false')] bg-cover bg-center" />
                                    <MapPin className="h-10 w-10 text-red-500 relative z-10" />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-slate-900">Neighborhood</h4>
                                    <p className="text-sm text-slate-500">{property.location}</p>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
