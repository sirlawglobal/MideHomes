import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updatedLocation = await prisma.location.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(updatedLocation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.location.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: 'Location deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
    }
}
