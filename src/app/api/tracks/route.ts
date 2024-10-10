import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 10; // You can adjust this value

  try {
    const tracks = await prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
        genre: genre ? { contains: genre, mode: 'insensitive' } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json({ error: "Error fetching tracks" }, { status: 500 });
  }
}