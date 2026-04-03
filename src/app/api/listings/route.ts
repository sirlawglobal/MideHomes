import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const location = searchParams.get('location');

        const where: any = {};
        if (type) where.type = type;
        if (category) where.category = category;
        if (location) where.location = { contains: location };

        const listings = await prisma.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                }
            }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const listing = await prisma.listing.create({
            data: {
                ...body,
                images: body.images || [],
            }
        });
        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error('Error creating listing:', error);
        return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
    }
}
