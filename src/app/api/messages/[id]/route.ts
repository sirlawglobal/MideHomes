import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updatedMessage = await prisma.message.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(updatedMessage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.message.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
