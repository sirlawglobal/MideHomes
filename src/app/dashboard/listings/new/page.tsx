"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useListingStore } from '@/store/useListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ListingForm } from '@/components/admin/ListingForm';
import { toast } from 'sonner';

export default function NewListingPage() {
    const { addListing } = useListingStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any, images: string[]) => {
        setIsSubmitting(true);
        try {
            await addListing({
                ...data,
                images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                agentId: user?.id || 'unknown',
            });
            toast.success('Listing created successfully');
            router.push('/dashboard/listings');
        } catch (error) {
            toast.error('Failed to create listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/listings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Listing</h1>
                    <p className="text-slate-500 mt-1">Create a new property listing for the public site.</p>
                </div>
            </div>

            <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}
