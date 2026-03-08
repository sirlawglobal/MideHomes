import { useState } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, Search, Map } from 'lucide-react';

export function Locations() {
    const { locations, addLocation } = useLocationStore();
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const handleAddLocation = (e: React.FormEvent) => {
        e.preventDefault();
        addLocation({
            id: Math.random().toString(36).substr(2, 9),
            city,
            state,
            properties: 0,
            status: 'Active',
        });
        setCity('');
        setState('');
        setIsAddOpen(false);
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Locations</h1>
                    <p className="text-slate-500 mt-1">Manage accepted cities, states, and regions.</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search locations..." className="pl-9" />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger render={
                            <Button className="bg-blue-900 hover:bg-blue-800">
                                <Plus className="h-4 w-4 mr-2" /> Add Location
                            </Button>
                        } />
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Supported Location</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddLocation} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>City / Neighborhood</Label>
                                    <Input required value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Brooklyn" />
                                </div>
                                <div className="space-y-2">
                                    <Label>State / Region</Label>
                                    <Input required value={state} onChange={e => setState(e.target.value)} placeholder="e.g., New York" />
                                </div>
                                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">Save Location</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead>Region/State</TableHead>
                            <TableHead>Active Properties</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((loc) => (
                            <TableRow key={loc.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Map className="h-4 w-4 text-slate-400" />
                                        {loc.city}
                                    </div>
                                </TableCell>
                                <TableCell>{loc.state}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-mono">{loc.properties}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={loc.status === 'Active' ? 'default' : 'secondary'} className={loc.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                        {loc.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
