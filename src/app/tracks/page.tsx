"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Track } from '@prisma/client'
import TrackDisplay from '@/src/components/TrackDisplay'

interface ExtendedTrack extends Track {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<ExtendedTrack[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genre, setGenre] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initialSearchTerm = searchParams.get('search') || ''
    const initialGenre = searchParams.get('genre') || ''
    const initialPage = parseInt(searchParams.get('page') || '1', 10)

    setSearchTerm(initialSearchTerm)
    setGenre(initialGenre)
    setPage(initialPage)

    fetchTracks(initialSearchTerm, initialGenre, initialPage)
  }, [searchParams])

  const fetchTracks = async (search: string, genre: string, page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tracks?search=${search}&genre=${genre}&page=${page}`)
      if (!response.ok) throw new Error('Failed to fetch tracks')
      const data = await response.json()
      setTracks(prevTracks => page > 1 ? [...prevTracks, ...data] : data)
    } catch (error) {
      console.error('Error fetching tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    router.push(`/tracks?search=${searchTerm}&genre=${genre}&page=1`)
  }

  const loadMore = () => {
    const nextPage = page + 1
    router.push(`/tracks?search=${searchTerm}&genre=${genre}&page=${nextPage}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tracks..."
          className="border p-2 rounded"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {/* Add genre options here */}
        </select>
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <TrackDisplay key={track.id} track={track} />
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!loading && tracks.length > 0 && (
        <button onClick={loadMore} className="mt-6 bg-gray-200 p-2 rounded mx-auto block">
          Load More
        </button>
      )}
    </div>
  )
}