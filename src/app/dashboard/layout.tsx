"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Tags,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { 
    icon: Building, 
    label: "Listings", 
    href: "/dashboard/listings",
    roles: ["superadmin", "admin", "agent", "developer"] 
  },
  { 
    icon: Users, 
    label: "Users", 
    href: "/dashboard/users", 
    roles: ["superadmin", "admin"] 
  },
  {
    icon: Tags,
    label: "Categories",
    href: "/dashboard/categories",
    roles: ["superadmin", "admin"],
  },
  { 
    icon: MapPin, 
    label: "Locations", 
    href: "/dashboard/locations",
    roles: ["superadmin", "admin"] 
  },
  { 
    icon: MessageSquare, 
    label: "Messages", 
    href: "/dashboard/messages",
    roles: ["superadmin", "admin", "agent", "developer"] 
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protected route check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=" + pathname);
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Filter sidebar items based on role
  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b justify-between lg:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-900"
          >
            <Building className="h-6 w-6 text-emerald-500" />
            <span>
              Mide<span className="text-sky-500">Homes</span>
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-500 hover:text-slate-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-blue-700" : "text-slate-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-slate-500">
              Welcome back, {user?.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
