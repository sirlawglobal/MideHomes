import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Building2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({
                id: '2',
                name: data.name,
                email: data.email,
                role: 'user', // newly registered users are 'user' by default
            });
            setIsLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

            {/* Image Side */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply z-10" />
                <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury apartment view"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
                    <blockquote className="text-2xl font-medium mb-4">
                        "We found our dream apartment in Manhattan through MideHomes within a week!"
                    </blockquote>
                    <p className="text-white/80 font-medium">— David & Emily Wright</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-24 relative">
                <div className="absolute top-8 right-8">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-900 group">
                        <Building2 className="h-6 w-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span>Mide<span className="text-sky-500">Homes</span></span>
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 mt-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
                        <p className="mt-2 text-slate-500">Join thousands finding their dream homes</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register('name')}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email')}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-11 mt-6" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign up"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-900 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
