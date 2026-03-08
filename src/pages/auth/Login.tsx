import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Building2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Mock user role based on email for testing
            const role = data.email.includes('super') ? 'superadmin' : data.email.includes('admin') ? 'admin' : 'user';

            login({
                id: '1',
                name: data.email.split('@')[0],
                email: data.email,
                role,
            });
            setIsLoading(false);

            // Redirect to admin if logic dictactes, or back to intended location
            const destination = role !== 'user' ? '/admin' : '/';
            const from = (location.state as any)?.from?.pathname || destination;
            navigate(from, { replace: true });
        }, 1000);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

            {/* Form Side */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-24 relative">
                <div className="absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-900 group">
                        <Building2 className="h-6 w-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span>Mide<span className="text-sky-500">Homes</span></span>
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 mt-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-slate-500">Log in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ex. admin@midehomes.com"
                                {...register('email')}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 italic">
                            Use "admin@...", "superadmin@..." or any email to test RBAC roles. Password can be anything (min 6 chars).
                        </div>

                        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-11" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-900 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Image Side */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
                <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury modern interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
                    <blockquote className="text-2xl font-medium mb-4">
                        "MideHomes helped us find the perfect administrative tools to manage our growing property portfolio."
                    </blockquote>
                    <p className="text-white/80 font-medium">— Sarah Jenkins, Property Manager</p>
                </div>
            </div>

        </div>
    );
}
