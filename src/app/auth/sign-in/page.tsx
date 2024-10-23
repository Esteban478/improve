'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/src/components/ui/button'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="p-2 border rounded"
        />
        <Button type="submit">
          Sign In
        </Button>
      </form>
    </main>
  )
}