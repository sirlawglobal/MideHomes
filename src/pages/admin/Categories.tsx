import { useState } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, Check, Settings2 } from 'lucide-react';

export function Categories() {
    const { categories, addCategory } = useCategoryStore();
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        addCategory({
            id: Math.random().toString(36).substr(2, 9),
            name,
            description,
            count: 0,
            status: 'Active',
        });
        setName('');
        setDescription('');
        setIsAddOpen(false);
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Property Categories</h1>
                    <p className="text-slate-500 mt-1">Manage global classification types for property listings.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger render={
                        <Button className="bg-blue-900 hover:bg-blue-800">
                            <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                    } />
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
                            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">Save Category</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-slate-900">{cat.name}</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2"><Settings2 className="h-4 w-4 text-slate-400" /></Button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 h-10">{cat.description}</p>
                        <div className="flexitems-center justify-between mt-auto">
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
        </div>
    );
}
