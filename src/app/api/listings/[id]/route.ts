import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        role: true,
                    }
                }
            }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(listing);
    } catch (error) {
        console.error('Error fetching property details:', error);
        return NextResponse.json({ error: 'Failed to fetch property details' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updatedListing = await prisma.listing.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(updatedListing);
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.listing.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
