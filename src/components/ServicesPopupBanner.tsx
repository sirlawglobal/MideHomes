"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ServicesPopupBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasDismissed, setHasDismissed] = useState(false);

    useEffect(() => {
        // Show after 1 minute (60000ms), only if not dismissed
        const timer = setTimeout(() => {
            if (!hasDismissed) {
                setIsVisible(true);
            }
        }, 60000);

        return () => clearTimeout(timer);
    }, [hasDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setHasDismissed(true);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                    <div className="bg-blue-900 p-4 text-white relative">
                        <button 
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2 mb-1">
                            <Wrench className="h-5 w-5 text-sky-400" />
                            <h3 className="font-bold text-lg">Need Professional Help?</h3>
                        </div>
                        <p className="text-blue-100 text-sm">We connect you with verified professionals.</p>
                    </div>
                    
                    <div className="p-5 bg-slate-50">
                        <ul className="space-y-2 mb-4">
                            {[
                                "Property Lawyer",
                                "Land Surveyor",
                                "Quantity Surveyor",
                                "Builder",
                                "Civil Engineer",
                                "Architect"
                            ].map((service, idx) => (
                                <li key={idx} className="flex items-center text-sm font-medium text-slate-700">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                    {service}
                                </li>
                            ))}
                        </ul>
                        
                        <Link href="/services" onClick={handleDismiss} className="flex items-center justify-center w-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors py-2 rounded-lg text-sm font-bold group">
                            Explore Services
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
