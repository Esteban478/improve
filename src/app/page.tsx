import { Track, Critique } from "@prisma/client";
import TrackDisplay from "@/src/components/TrackDisplay";

async function getTracks() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/tracks`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }
  return res.json();
}

export default async function Home() {
  const tracks: (Track & { user: { name: string | null; image: string | null; email: string | null }; critiques: Critique[] })[] = await getTracks();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Tracks</h1>
      <div className="space-y-8">
        {tracks.map((track) => (
          <TrackDisplay key={track.id} track={track} />
        ))}
      </div>
    </main>
  );
}