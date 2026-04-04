"use client";

import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Settings2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
    const { categories, fetchCategories, addCategory, isLoading } = useCategoryStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addCategory({
                name,
                description,
                status: 'Active',
            });
            toast.success('Category added successfully');
            setName('');
            setDescription('');
            setIsAddOpen(false);
        } catch (error) {
            toast.error('Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Property Categories</h1>
                    <p className="text-slate-500 mt-1">Manage global classification types for property listings.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger 
                      render={
                        <Button className="bg-blue-900 hover:bg-blue-800">
                            <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                      }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Industrial" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this category type" />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-900 hover:bg-blue-800">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Category
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && categories.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border text-center text-slate-500">
                    No categories found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-slate-900">{cat.name}</h3>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2"><Settings2 className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{cat.description}</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                    {cat.count} Listings
                                </Badge>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                    <Check className="h-3 w-3 mr-1" /> {cat.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
