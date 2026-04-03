import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');

        const where: any = {};
        if (agentId) where.agentId = agentId;

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                listing: {
                    select: { title: true }
                }
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const message = await prisma.message.create({
            data: body
        });
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
