"use client";

import { motion, Variants } from "framer-motion";
import { 
  Scale, 
  Map, 
  Calculator, 
  Hammer, 
  HardHat, 
  PencilRuler, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  MessageCircle,
  Mail
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const services = [
  {
    title: "Property Lawyer",
    description: "Expert legal advice for property acquisition, title verification, and airtight sales documentation.",
    icon: Scale,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Land Surveyor",
    description: "Precision boundary mapping, topographical surveys, and official land measurements for peace of mind.",
    icon: Map,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Quantity Surveyor",
    description: "Accurate cost estimation, project budgeting, and material valuation to keep your project on track.",
    icon: Calculator,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Builder",
    description: "Professional construction management, quality building work, and expert renovations.",
    icon: Hammer,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Civil Engineer",
    description: "Infrastructure design, site planning, and structural integrity assessments for durable projects.",
    icon: HardHat,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  {
    title: "Architect",
    description: "Creative building design, detailed blueprints, and aesthetic planning for your dream structure.",
    icon: PencilRuler,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function ServicesPage() {
  return (
    <div className="flex-1 pb-20">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Professional Real Estate <span className="text-sky-400">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Connecting you with top-tier professionals to ensure your property journey is seamless, secure, and successful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="h-full border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      render={
                        <span className={cn(buttonVariants({ variant: "ghost" }), "p-0 text-sky-600 hover:text-sky-700 hover:bg-transparent group-hover:translate-x-1 transition-all cursor-pointer inline-flex items-center")}>
                          Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      }
                    />
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem 
                        render={
                          <a 
                            href={`https://wa.me/2348165999946?text=Hi, I'm interested in your ${service.title} service from MideHomes.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 cursor-pointer w-full"
                          />
                        }
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                        <span>WhatsApp</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        render={
                          <a 
                            href={`mailto:hello@midehomes.com?subject=Inquiry: ${service.title}&body=Hi, I'm interested in your ${service.title} service.`}
                            className="flex items-center gap-2 cursor-pointer w-full"
                          />
                        }
                      >
                        <Mail className="h-4 w-4 text-sky-600" />
                        <span>Send Email</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Use Our Services */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Professionals?</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Experts</h3>
              <p className="text-slate-500 text-sm">Every professional is vetted for credentials and track record.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Seamless Integration</h3>
              <p className="text-slate-500 text-sm">Efficient coordination between different service categories.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Customer Priority</h3>
              <p className="text-slate-500 text-sm">Dedicated support to ensure your specific needs are met.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Contact us today to be matched with the right professional for your property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <DropdownMenu>
                <DropdownMenuTrigger 
                  render={
                    <span className={cn(buttonVariants({ size: "lg" }), "bg-emerald-500 hover:bg-emerald-600 text-white px-8 cursor-pointer inline-flex items-center")}>
                      Consult an Expert
                    </span>
                  }
                />
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuItem 
                    render={
                      <a 
                        href="https://wa.me/2348165999946?text=Hi, I'd like to consult with an expert on MideHomes."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      />
                    }
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">WhatsApp Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    render={
                      <a 
                        href="mailto:hello@midehomes.com?subject=Expert Consultation Request"
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      />
                    }
                  >
                    <Mail className="h-5 w-5 text-sky-600" />
                    <span className="font-medium">Send Support Email</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
             <Link href="/listings">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8">
                Explore Properties
                </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
