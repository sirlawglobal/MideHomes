"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Save,
    Settings2,
    Building2,
    Mail,
    Phone,
    MapPin,
    Key,
    ShieldCheck,
    Globe,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SettingsTab = 'general' | 'identity' | 'api' | 'security';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            toast.success('Settings updated successfully');
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const navItems = [
        { id: 'general', label: 'General System', icon: Settings2, desc: 'Core platform behavior' },
        { id: 'identity', label: 'Brand Identity', icon: Building2, desc: 'Logos, names, & contact' },
        { id: 'api', label: 'API & Integrations', icon: Key, desc: 'Maps, Mail, & Payments' },
        { id: 'security', label: 'Security & Access', icon: ShieldCheck, desc: 'Policies & maintenance' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Platform Configuration</h1>
                    <p className="text-slate-500 text-lg mt-2">Manage your global system settings and external service integrations.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-right-4 duration-300">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Changes saved!</span>
                        </div>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "h-11 px-8 text-base shadow-lg transition-all active:scale-95",
                            showSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-900 hover:bg-blue-800"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-2" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Vertical Sidebar Nav */}
                <aside className="lg:col-span-3 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as SettingsTab)}
                                className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group",
                                    isActive
                                        ? "bg-white shadow-md shadow-slate-200/50 border border-slate-100"
                                        : "hover:bg-slate-100/50 text-slate-500"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-colors",
                                    isActive ? "bg-blue-900 text-white shadow-blue-200" : "bg-white border text-slate-400 group-hover:bg-white group-hover:text-blue-900"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "font-bold text-sm tracking-tight transition-colors",
                                        isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
                                    )}>
                                        {item.label}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400 mt-0.5 leading-tight">{item.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg"><Settings2 className="h-5 w-5 text-blue-900" /></div>
                                        <div>
                                            <CardTitle>Core System Behavior</CardTitle>
                                            <CardDescription>Configure how the platform handles listings and regional defaults.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Primary Currency</Label>
                                            <Input defaultValue="USD ($)" className="bg-slate-50 focus-visible:bg-white h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Measurement Unit</Label>
                                            <Input defaultValue="Square Feet (sqft)" className="bg-slate-50 focus-visible:bg-white h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Default Timezone</Label>
                                            <Input defaultValue="GMT+1 (West Africa Time)" className="bg-slate-50 focus-visible:bg-white h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">System Language</Label>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-slate-400" />
                                                <Input defaultValue="English (US)" className="bg-slate-50 focus-visible:bg-white h-11" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'identity' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-100 p-2 rounded-lg"><Building2 className="h-5 w-5 text-emerald-600" /></div>
                                        <div>
                                            <CardTitle>Public Branding</CardTitle>
                                            <CardDescription>Manage your platform name and outward corporate identity.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold uppercase text-[10px] tracking-wider">Platform Name</Label>
                                            <Input defaultValue="MideHomes" className="h-11 font-bold text-slate-900 focus-visible:ring-blue-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold uppercase text-[10px] tracking-wider">Public Support Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input defaultValue="support@midehomes.com" className="pl-10 h-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold uppercase text-[10px] tracking-wider">Hotline Contact</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input defaultValue="+1 (555) 000-0000" className="pl-10 h-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold uppercase text-[10px] tracking-wider">Headquarters Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                                                <Textarea defaultValue="Okota Road, Ire Akari, Isolo, Lagos" className="pl-10 min-h-[110px]" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-lg"><Key className="h-5 w-5 text-amber-600" /></div>
                                        <div>
                                            <CardTitle>API & External Services</CardTitle>
                                            <CardDescription>Securely connect to third-party providers for mapping and email.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1 mb-2">
                                            <Label className="text-slate-900 font-bold">Google Maps API</Label>
                                            <p className="text-xs text-slate-500">Powers property location pins and street view rendering.</p>
                                        </div>
                                        <Input type="password" defaultValue="AIzaSyAXXXXXXXXXXXXXXXXXXXXX" className="h-11 font-mono tracking-widest bg-slate-50" />
                                    </div>
                                    <div className="h-px bg-slate-100 w-full" />
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1 mb-2">
                                            <Label className="text-slate-900 font-bold">Transactional Email Provider</Label>
                                            <p className="text-xs text-slate-500">Drives agent inquiry notifications and user registrations.</p>
                                        </div>
                                        <Input type="password" defaultValue="SG.XXXXXXXXXXXXXXXXXXXXXX" className="h-11 font-mono tracking-widest bg-slate-50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded-lg"><ShieldCheck className="h-5 w-5 text-red-600" /></div>
                                        <div>
                                            <CardTitle>System Policies</CardTitle>
                                            <CardDescription>Enforce rules for administrative workflows and public access.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-2">
                                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="space-y-1">
                                            <Label className="text-base font-bold text-slate-900">Enforce Listing Approval</Label>
                                            <p className="text-sm text-slate-500 max-w-md">New properties added by Agents will require Super Admin approval before going public.</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-blue-900" />
                                    </div>
                                    <div className="h-px bg-slate-100 w-full" />
                                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="space-y-1">
                                            <Label className="text-base font-bold text-slate-900">Allow Global User Registration</Label>
                                            <p className="text-sm text-slate-500 max-w-md">Enable the signup page for new public users. Disable to make the platform invite-only.</p>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-blue-900" />
                                    </div>
                                    <div className="h-px bg-slate-100 w-full" />
                                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-red-50/50 transition-colors group">
                                        <div className="space-y-1">
                                            <Label className="text-base font-bold text-red-600">Maintenance Protocol</Label>
                                            <p className="text-sm text-slate-500 max-w-md">Suspend all public traffic immediately. Only authenticated Super Admins will bypass the lockdown.</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-red-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
