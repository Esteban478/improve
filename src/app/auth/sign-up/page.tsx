'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/actions/auth-actions'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { UserRoleDropdown } from '@/components/UserRoleDropdown'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const validateForm = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setError('Password must contain both letters and numbers')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!role) {
      setError('Please select your role')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('role', role)

      await signUp(formData)
      router.push('/auth/sign-in')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-2 border rounded w-full"
          />
          <PasswordStrengthMeter password={password} />
        </div>
        <UserRoleDropdown
          value={role}
          onValueChange={setRole}
          required={true}
        />
        <Button type="submit">
          Sign Up
        </Button>
      </form>
    </main>
  )
}