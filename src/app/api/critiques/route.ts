import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      trackId,
      mixingQuality,
      tonalBalance,
      masteringLoudness,
      soundDesign,
      arrangement,
      technicalSummary,
      emotionalResponse,
      imagery,
      standoutElements,
      genreFit,
      overallImpression
    } = await request.json();

    if (!trackId || !overallImpression) {
      return NextResponse.json({ error: "Track ID and overall impression are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newCritique = await prisma.critique.create({
      data: {
        trackId,
        userId: user.id,
        mixingQuality,
        tonalBalance,
        masteringLoudness,
        soundDesign,
        arrangement,
        technicalSummary,
        emotionalResponse,
        imagery,
        standoutElements,
        genreFit,
        overallImpression
      },
    });

    return NextResponse.json(newCritique, { status: 201 });
  } catch (error) {
    console.error("Error submitting critique:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}