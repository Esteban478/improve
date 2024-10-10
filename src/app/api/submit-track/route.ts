import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, url, genre } = await request.json();

    // Basic validation
    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    // Extract user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Store the URL without any encoding
    const decodedUrl = decodeURIComponent(url);

    // Create new track
    const newTrack = await prisma.track.create({
      data: {
        title,
        description: description || undefined, // This line handles the case where description might be an empty string
        url: decodedUrl,
        genre: genre || undefined, // This line handles the case where genre might be an empty string
        userId: user.id,
      },
    });

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    console.error("Error submitting track:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Error submitting track: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred while submitting track" }, { status: 500 });
  }
}