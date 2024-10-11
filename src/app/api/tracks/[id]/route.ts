import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        critiques: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    return NextResponse.json({ error: "Error fetching track" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { critiqueId, ...critiqueData } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingCritique = await prisma.critique.findUnique({
      where: { id: critiqueId },
    });

    if (!existingCritique || existingCritique.userId !== user.id) {
      return NextResponse.json({ error: "Critique not found or unauthorized" }, { status: 404 });
    }

    const updatedCritique = await prisma.critique.update({
      where: { id: critiqueId },
      data: critiqueData,
    });

    return NextResponse.json(updatedCritique);
  } catch (error) {
    console.error("Error updating critique:", error);
    return NextResponse.json({ error: "Error updating critique" }, { status: 500 });
  }
}