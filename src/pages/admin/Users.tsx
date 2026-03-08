import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { MoreHorizontal, ShieldAlert, UserX, Plus } from 'lucide-react';
import type { Role } from '../../store/useAuthStore';

export function Users() {
    const { users, addUser, updateUser, deleteUser } = useUserStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState<typeof users[0] | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('user');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();

        addUser({
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role,
            joined: new Date().toISOString(),
            status: 'Active',
        });

        setIsAddOpen(false);
        setName('');
        setEmail('');
        setRole('user');
    };

    const openRoleDialog = (user: typeof users[0]) => {
        setSelectedUserForRole(user);
        setIsRoleOpen(true);
    };

    const handleChangeRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserForRole) {
            updateUser(selectedUserForRole.id, { role: selectedUserForRole.role });
            setIsRoleOpen(false);
            setSelectedUserForRole(null);
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
                    <DialogTrigger render={<Button className="bg-blue-900 hover:bg-blue-800" />}>
                        <Plus className="h-4 w-4 mr-2" /> Add New User
                    </DialogTrigger>
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
                                <Button type="submit" className="bg-blue-900 hover:bg-blue-800">Save User</Button>
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
                                    <Button type="submit" className="bg-blue-900 hover:bg-blue-800">Save Changes</Button>
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
                        {users.map((u) => (
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
                                <TableCell>{new Date(u.joined).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={u.status === 'Active' ? 'default' : 'secondary'}>
                                        {u.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-8 w-8 p-0 text-slate-500">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openRoleDialog(u)}>
                                                <ShieldAlert className="mr-2 h-4 w-4" /> Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => deleteUser(u.id)}>
                                                <UserX className="mr-2 h-4 w-4" /> Deactivate Account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
