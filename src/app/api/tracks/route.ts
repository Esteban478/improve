import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const tracks = await prisma.track.findMany()
  return NextResponse.json(tracks)
}

export async function POST(request: Request) {
  const body = await request.json()
  const track = await prisma.track.create({
    data: {
      title: body.title,
      url: body.url,
      userId: body.userId,
    },
  })
  return NextResponse.json(track)
}