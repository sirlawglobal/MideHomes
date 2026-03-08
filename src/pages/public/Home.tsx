import { Link } from 'react-router-dom';
import { MOCK_LISTINGS } from '../../store/useListingStore';
import { PropertyCard } from '../../components/PropertyCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Home as HomeIcon, Key, Calendar } from 'lucide-react';

export function Home() {
    const featured = MOCK_LISTINGS.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-900/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Home"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Find Your Dream Home in Lagos
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
                        Discover the finest properties across Ikoyi, Lekki, and beyond. MideHomes brings you the most exclusive listings in Nigeria.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row gap-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input
                                placeholder="Search by city, neighborhood or zip"
                                className="pl-12 border-none bg-transparent focus-visible:ring-0 shadow-none text-base"
                            />
                        </div>
                        <Button size="lg" className="rounded-full bg-blue-900 hover:bg-blue-800 px-8">
                            Search
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Categories</h2>
                        <p className="text-slate-600">Find properties that suit your specific needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { icon: HomeIcon, title: 'Buy a Property', desc: 'Find your permanent dream home.', color: 'text-blue-500', bg: 'bg-blue-100' },
                            { icon: Key, title: 'Rent a Property', desc: 'Discover beautiful rental homes.', color: 'text-emerald-500', bg: 'bg-emerald-100' },
                            { icon: Calendar, title: 'Short Lets', desc: 'Perfect for holidays and business trips.', color: 'text-sky-500', bg: 'bg-sky-100' },
                        ].map((cat) => (
                            <div key={cat.title} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer border border-slate-100">
                                <div className={`h-16 w-16 ${cat.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    <cat.icon className={`h-8 w-8 ${cat.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{cat.title}</h3>
                                <p className="text-slate-500">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Listings</h2>
                            <p className="text-slate-600 max-w-2xl">Browse our handpicked selection of premium properties waiting for you.</p>
                        </div>
                        <Button variant="outline" render={<Link to="/listings" />} className="hidden md:flex mt-4 md:mt-0">
                            View All Properties
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featured.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    <Button variant="outline" render={<Link to="/listings" />} className="w-full mt-8 md:hidden">
                        View All Properties
                    </Button>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-600 rounded-full blur-3xl opacity-30"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your dream home?</h2>
                    <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of users who have already found their perfect property through MideHomes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100" render={<Link to="/listings" />}>
                            Start Browsing
                        </Button>
                        <Button size="lg" variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-800 hover:text-white" render={<Link to="/register" />}>
                            Create an Account
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
