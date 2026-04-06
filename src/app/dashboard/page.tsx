"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useListingStore } from '@/store/useListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Home, Eye, Users, TrendingUp, Bookmark, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', views: 4000 },
    { name: 'Feb', views: 3000 },
    { name: 'Mar', views: 2000 },
    { name: 'Apr', views: 2780 },
    { name: 'May', views: 1890 },
    { name: 'Jun', views: 2390 },
    { name: 'Jul', views: 3490 },
];

export default function DashboardOverviewPage() {
    const { listings, fetchListings } = useListingStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Role-based filtering
    const displayListings = (user?.role === 'admin' || user?.role === 'superadmin')
        ? listings
        : listings.filter(l => l.agentId === user?.id);

    const activeListings = displayListings.filter(l => l.status === 'Active').length;
    const totalValue = displayListings.reduce((acc, l) => acc + (l.type === 'Buy' ? l.price : 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">
                    {user?.role === 'user' ? 'Member Portal' : `${user?.role} Dashboard`}
                </h1>
                <p className="text-slate-500 mt-1">
                    {user?.role === 'user' 
                        ? "Welcome back! Manage your saved properties and messages here."
                        : `Here's a summary of your ${user?.role === 'admin' || user?.role === 'superadmin' ? 'platform' : 'property'} portfolio.`}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {user?.role === 'user' ? 'Saved Properties' : 'Total Listings'}
                        </CardTitle>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            {user?.role === 'user' ? <Bookmark className="h-4 w-4 text-blue-600" /> : <Home className="h-4 w-4 text-blue-600" />}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {user?.role === 'user' ? (user?.savedProperties?.length || 0) : displayListings.length}
                        </div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {user?.role === 'user' ? 'Messages' : 'Active Properties'}
                        </CardTitle>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            {user?.role === 'user' ? <MessageCircle className="h-4 w-4 text-emerald-600" /> : <Home className="h-4 w-4 text-emerald-600" />}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {user?.role === 'user' ? '0' : activeListings}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {user?.role === 'user' ? 'Inquiries sent to agents' : 'Properties currently on market'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Views</CardTitle>
                        <div className="p-2 bg-sky-50 rounded-lg"><Eye className="h-4 w-4 text-sky-600" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {user?.role === 'user' ? '12' : '24.5k'}
                        </div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +18% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {user?.role === 'user' ? 'Reward Points' : 'Total Portfolio Value'}
                        </CardTitle>
                        <div className="p-2 bg-indigo-50 rounded-lg"><Users className="h-4 w-4 text-indigo-600" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {user?.role === 'user' ? '450' : `$${(totalValue / 1000000).toFixed(1)}M`}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {user?.role === 'user' ? 'Earned from community engagement' : 'Estimated total worth of properties'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Property Views (Last 7 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { label: 'New listing added', time: '2 hours ago', user: 'Admin' },
                                { label: 'Property marked as sold', time: '5 hours ago', user: 'Super Admin' },
                                { label: 'Price updated', time: '1 day ago', user: user?.name || 'Owner' },
                                { label: 'Profile updated', time: '2 days ago', user: 'System' },
                            ].map((activity, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{activity.label}</p>
                                        <p className="text-xs text-slate-500">{activity.time} by {activity.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
