"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useListingStore, Listing } from '@/store/useListingStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ListingForm } from '@/components/admin/ListingForm';
import { toast } from 'sonner';
import axios from 'axios';

export default function EditListingPage() {
    const params = useParams();
    const id = params?.id as string;
    const { updateListing } = useListingStore();
    const router = useRouter();
    
    const [initialData, setInitialData] = useState<Listing | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadListing = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/listings/${id}`);
                setInitialData(response.data);
            } catch (error) {
                toast.error('Failed to load listing details');
                router.push('/dashboard/listings');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadListing();
        }
    }, [id, router]);

    const handleSubmit = async (data: any, images: string[]) => {
        setIsSubmitting(true);
        try {
            await updateListing(id, {
                ...data,
                images: images.length > 0 ? images : initialData?.images,
            });
            toast.success('Listing updated successfully');
            router.push('/dashboard/listings');
        } catch (error) {
            toast.error('Failed to update listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/listings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Listing</h1>
                    <p className="text-slate-500 mt-1">Update property details for the public site.</p>
                </div>
            </div>

            <ListingForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}
