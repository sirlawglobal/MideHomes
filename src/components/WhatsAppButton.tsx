"use client";

import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const WhatsAppButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a short delay for a nice entrance
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const whatsappUrl = "https://wa.me/2348163603702?text=Hello MideHomes, I'd like to inquire about your services.";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.5 
                    }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group flex items-center"
                        aria-label="Contact support on WhatsApp"
                    >
                        {/* Status Glow / Pulse */}
                        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-20 animate-pulse group-hover:opacity-40 transition-opacity blur-md"></span>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/30 group-hover:animate-ping transition-all"></span>
                        
                        {/* Main Button Container */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-full shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
                        >
                            <MessageCircle className="h-6 w-6 stroke-[2.5px]" />
                            <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm tracking-wide">
                                Chat with Support
                            </span>
                            
                            {/* Online indicator */}
                            <span className="absolute top-3 right-4 h-2 w-2 bg-emerald-200 rounded-full border border-emerald-500 animate-pulse group-hover:hidden"></span>
                        </motion.div>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
