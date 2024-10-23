'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { submitTrack } from '@/actions/track-actions'
import ErrorDisplay from '@/components/ErrorDisplay'
import { catchErrorTyped } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'

export default function SubmitTrack() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (!session?.user?.email) {
      setError("You must be logged in to submit a track.")
      return
    }

    formData.append('userEmail', session.user.email)
    const [submitError] = await catchErrorTyped(submitTrack(formData))

    if (submitError) {
      console.error('Error submitting track:', submitError)
      setError(submitError.message || "Failed to submit track. Please try again.")
    } else {
      router.push('/dashboard')
    }
  }

  if (!session) {
    return <ErrorDisplay message="Please log in to submit a track." />
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Submit a Track</h1>
      {error && <ErrorDisplay message={error} />}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <Input type="text" id="title" name="title" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <Textarea id="description" name="description" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="url" className="block mb-1">SoundCloud URL</label>
          <Input type="url" id="url" name="url" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="genre" className="block mb-1">Genre</label>
          <Input type="text" id="genre" name="genre" className="w-full px-3 py-2 border rounded" />
        </div>
        <Button type="submit" className="w-full text-white py-2 rounded">
          Submit Track
        </Button>
      </form>
    </div>
  )
}