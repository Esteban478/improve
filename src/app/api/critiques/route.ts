import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId, content } = await request.json();

    if (!trackId || !content) {
      return NextResponse.json({ error: "Track ID and content are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newCritique = await prisma.critique.create({
      data: {
        content,
        trackId,
        userId: user.id,
      },
    });

    return NextResponse.json(newCritique, { status: 201 });
  } catch (error) {
    console.error("Error submitting critique:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}