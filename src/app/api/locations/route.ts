import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            where: { status: 'Active' },
            orderBy: { state: 'asc' },
        });
        return NextResponse.json(locations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const location = await prisma.location.create({ data: body });
        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
    }
}
