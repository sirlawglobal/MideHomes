"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useListingStore, Listing } from '@/store/useListingStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useLocationStore } from '@/store/useLocationStore';
import Link from 'next/link';
import { UploadCloud, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const listingSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(1, 'Price must be greater than 0'),
    location: z.string().min(3, 'Location is required'),
    category: z.string().min(1, 'Category is required'),
    type: z.enum(['Rent', 'Buy', 'Short Let']),
    status: z.enum(['Active', 'Pending', 'Sold']),
    bedrooms: z.coerce.number().min(0).optional(),
    bathrooms: z.coerce.number().min(0).optional(),
    sqft: z.coerce.number().min(1),
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface ListingFormProps {
    initialData?: Listing;
    onSubmit: (data: ListingFormValues, images: string[]) => Promise<void>;
    isSubmitting: boolean;
}

export function ListingForm({ initialData, onSubmit, isSubmitting }: ListingFormProps) {
    const { categories, fetchCategories } = useCategoryStore();
    const { locations, fetchLocations } = useLocationStore();

    useEffect(() => {
        fetchCategories();
        fetchLocations();
    }, [fetchCategories, fetchLocations]);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ListingFormValues>({
        resolver: zodResolver(listingSchema) as any,
        defaultValues: initialData || {
            type: 'Buy',
            status: 'Active',
            bedrooms: 1,
            bathrooms: 1,
            sqft: 1000,
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const typeValue = watch('type');
    const statusValue = watch('status');
    const categoryValue = watch('category');

    const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // In a real app, we would upload to S3/Cloudinary and get URLs
            // For now, we'll use blob URLs or placeholders to simulate local success
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            const url = newPreviews[index];
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleFormSubmit = async (data: ListingFormValues) => {
        try {
            await onSubmit(data, imagePreviews);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
                            <Input id="title" placeholder="Luxury Apartment in Lagos" {...register('title')} />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                placeholder="Detailed description of the property..."
                                className="min-h-[120px]"
                                {...register('description')}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                            <Input id="price" type="number" placeholder="500000" {...register('price')} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Location / Address <span className="text-red-500">*</span></Label>
                            <Select value={watch('location')} onValueChange={(v) => setValue('location', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.filter(l => l.status === 'Active').map(loc => (
                                        <SelectItem key={loc.id} value={`${loc.city}, ${loc.state}`}>
                                            {loc.city}, {loc.state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Details & Specs */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">Specifications</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <Label>Select Category <span className="text-red-500">*</span></Label>
                            <Select value={categoryValue} onValueChange={(v) => setValue('category', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.status === 'Active').map(cat => (
                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {categoryValue !== 'Land' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input id="bedrooms" type="number" {...register('bedrooms')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input id="bathrooms" type="number" step="0.5" {...register('bathrooms')} />
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="sqft">{categoryValue === 'Land' ? 'Size (sqm/Plots)' : 'Square Feet (sqft)'}</Label>
                            <Input id="sqft" type="number" {...register('sqft')} />
                        </div>

                        <div className="space-y-2">
                            <Label>Listing Type</Label>
                            <Select value={typeValue} onValueChange={(v) => setValue('type', v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Buy">Buy</SelectItem>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Short Let">Short Let</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Visibility Status</Label>
                            <Select value={statusValue} onValueChange={(v) => setValue('status', v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Sold">Sold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">Images</h3>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden border">
                                    <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="block border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-900 font-medium mb-1">Click or drag images to upload</p>
                        <p className="text-slate-500 text-sm">PNG, JPG up to 5MB</p>
                        <Input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Link href="/admin/listings">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" className="bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Saving..." : (initialData ? "Update Listing" : "Save Listing")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
