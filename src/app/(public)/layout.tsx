"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-900"
          >
            <Building2 className="h-6 w-6 text-emerald-500" />
            <span>
              Mide<span className="text-sky-500">Homes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className={`text-sm font-medium hover:text-sky-600 transition-colors ${
                pathname === "/" ? "text-sky-600" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/listings"
              className={`text-sm font-medium hover:text-sky-600 transition-colors ${
                pathname === "/listings" ? "text-sky-600" : ""
              }`}
            >
              Properties
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" || user?.role === "superadmin" ? (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    My Profile
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-sky-600 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-900 hover:bg-blue-800">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4 shadow-lg">
            <Link
              href="/"
              className="text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/listings"
              className="text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Properties
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" || user?.role === "superadmin" ? (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-emerald-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-sky-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-blue-900 hover:bg-blue-800">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-white mb-4"
            >
              <Building2 className="h-6 w-6 text-emerald-500" />
              <span>
                Mide<span className="text-sky-500">Homes</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Discover your dream property with our modern real estate platform.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings" className="hover:text-emerald-400">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400">
                  Agent Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Okota Road</li>
              <li>Ire Akari, Isolo, Lagos</li>
              <li>hello@midehomes.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the latest property updates.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} MideHomes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
