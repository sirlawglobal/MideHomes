"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal, ShieldAlert, UserX, Plus, Loader2 } from 'lucide-react';
import type { Role } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const { users, fetchUsers, addUser, updateUser, deleteUser, isLoading } = useUserStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('user');

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addUser({
                name,
                email,
                role,
                status: 'Active',
            });
            toast.success('User added successfully');
            setIsAddOpen(false);
            setName('');
            setEmail('');
            setRole('user');
        } catch (error) {
            toast.error('Failed to add user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openRoleDialog = (user: any) => {
        setSelectedUserForRole({ ...user });
        setIsRoleOpen(true);
    };

    const handleChangeRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserForRole) {
            setIsSubmitting(true);
            try {
                await updateUser(selectedUserForRole.id, { role: selectedUserForRole.role });
                toast.success('User role updated');
                setIsRoleOpen(false);
                setSelectedUserForRole(null);
            } catch (error) {
                toast.error('Failed to update role');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (confirm('Are you sure you want to deactivate this account?')) {
            try {
                await deleteUser(id);
                toast.success('User account deactivated');
            } catch (error) {
                toast.error('Failed to deactivate account');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 mt-1">Super Admin controls for system roles and access.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger 
                      render={
                        <Button className="bg-blue-900 hover:bg-blue-800">
                            <Plus className="h-4 w-4 mr-2" /> Add New User
                        </Button>
                      }
                    />
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role || 'user'} onValueChange={(v) => setRole(v as Role)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Regular User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting} className="bg-blue-900 hover:bg-blue-800">
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save User
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                        </DialogHeader>
                        {selectedUserForRole && (
                            <form onSubmit={handleChangeRole} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>User</Label>
                                    <Input disabled value={selectedUserForRole.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                        value={selectedUserForRole.role}
                                        onValueChange={(v) => setSelectedUserForRole({ ...selectedUserForRole, role: v as Role })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Regular User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="superadmin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isSubmitting} className="bg-blue-900 hover:bg-blue-800">
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-900" />
                                        <span>Loading users...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-semibold text-slate-600">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{u.name}</p>
                                                <p className="text-sm text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                u.role === 'superadmin' ? 'border-red-500 text-red-600' :
                                                    u.role === 'admin' ? 'border-blue-500 text-blue-600' : ''
                                            }
                                        >
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.status === 'Active' ? 'default' : 'secondary'}>
                                            {u.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                        <DropdownMenuTrigger 
                                          render={
                                              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500">
                                                  <span className="sr-only">Open menu</span>
                                                  <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                          }
                                        />
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openRoleDialog(u)}>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteUser(u.id)}>
                                                    <UserX className="mr-2 h-4 w-4" /> Deactivate Account
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
