'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { submitTrack } from '@/actions/actions'

export default function SubmitTrack() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (formData: FormData) => {
    if (!session?.user?.email) {
      alert('You must be logged in to submit a track.')
      return
    }

    try {
      formData.append('userEmail', session.user.email)
      await submitTrack(formData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error submitting track:', error)
      if (error instanceof Error) {
        alert(`Failed to submit track. Error: ${error.message}`)
      } else {
        alert('Failed to submit track. Please try again.')
      }
    }
  }

  if (!session) {
    return <div>Please log in to submit a track.</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Submit a Track</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input type="text" id="title" name="title" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea id="description" name="description" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="url" className="block mb-1">SoundCloud URL</label>
          <input type="url" id="url" name="url" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="genre" className="block mb-1">Genre</label>
          <input type="text" id="genre" name="genre" className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Submit Track
        </button>
      </form>
    </div>
  )
}