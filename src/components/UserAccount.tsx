"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import UserAvatar from './UserAvatar'

export default function UserAccount() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="space-x-4">
        <Link href="/auth/sign-in" className="hover:text-gray-300">Login</Link>
        <Link href="/auth/sign-up" className="hover:text-gray-300">Register</Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2"
      >
        <UserAvatar src={session.user?.image} alt={session.user?.name || 'User'} size={32} />
        <span>{session.user?.name}</span>
        <span className="text-yellow-400">{/* Add coin balance here */} coins</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/submit-track" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Submit Track
          </Link>
          <button 
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}