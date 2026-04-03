import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, role, password } = body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: (role || 'user') as any,
                password: password || 'password123',
                status: 'Active',
            }
        });

        const { password: _, ...userData } = user;

        return NextResponse.json(userData, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
