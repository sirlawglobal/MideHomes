import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useListingStore } from '../../store/useListingStore';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const listingSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(1, 'Price must be greater than 0'),
    location: z.string().min(3, 'Location is required'),
    type: z.enum(['Rent', 'Buy', 'Short Let']),
    status: z.enum(['Active', 'Pending', 'Sold']),
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    sqft: z.coerce.number().min(100),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export function ListingEdit() {
    const { id } = useParams<{ id: string }>();
    const { listings, updateListing } = useListingStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const existingListing = listings.find(l => l.id === id);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ListingFormValues>({
        resolver: zodResolver(listingSchema) as any,
        defaultValues: existingListing || {
            title: '',
            description: '',
            price: 0,
            location: '',
            type: 'Buy',
            status: 'Active',
            bedrooms: 1,
            bathrooms: 1,
            sqft: 1000,
        }
    });

    useEffect(() => {
        if (!existingListing) {
            navigate('/admin/listings');
        } else {
            reset(existingListing);
        }
    }, [existingListing, navigate, reset]);

    const typeValue = watch('type');
    const statusValue = watch('status');

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(existingListing?.images || []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
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

    if (!existingListing) return null;

    const onSubmit = (data: any) => {
        setIsSubmitting(true);

        setTimeout(() => {
            updateListing(existingListing.id, {
                ...data,
                images: imagePreviews.length > 0 ? imagePreviews : existingListing.images,
            });
            setIsSubmitting(false);
            navigate('/admin/listings');
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" render={<Link to="/admin/listings" />}>
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Listing</h1>
                    <p className="text-slate-500 mt-1">Update property details.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="Luxury Apartment in Downtown" {...register('title')} />
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
                                <Label htmlFor="location">Location / Address <span className="text-red-500">*</span></Label>
                                <Input id="location" placeholder="New York, NY" {...register('location')} />
                                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Details & Specs */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">Specifications</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                <Input id="bedrooms" type="number" {...register('bedrooms')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <Input id="bathrooms" type="number" step="0.5" {...register('bathrooms')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sqft">Square Feet</Label>
                                <Input id="sqft" type="number" {...register('sqft')} />
                            </div>

                            <div className="space-y-2">
                                <Label>Property Type</Label>
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
                                <Label>Status</Label>
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
                        <Button type="button" variant="outline" render={<Link to="/admin/listings" />}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Update Listing
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
