import { useState } from 'react';
import { useListingStore } from '../../store/useListingStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { MoreHorizontal, Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function ListingsManager() {
  const { listings, deleteListing } = useListingStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Properties</h1>
          <p className="text-slate-500 mt-1">Manage your real estate catalog.</p>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <Button className="bg-blue-900 hover:bg-blue-800" render={<Link to="/admin/listings/new" />}>
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No listings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.images[0] || 'https://via.placeholder.com/40'}
                        alt="Thumbnail"
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="line-clamp-1 max-w-[200px]">{listing.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>${listing.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{listing.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={listing.status === 'Active' ? 'default' : 'secondary'}
                      className={listing.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-8 w-8 p-0 text-slate-500">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/properties/${listing.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View public page
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/listings/${listing.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
