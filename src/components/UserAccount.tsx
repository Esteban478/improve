"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import UserAvatar from './UserAvatar'

export default function UserAccount() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLinkClick = () => {
    setIsDropdownOpen(false)
  }

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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2"
      >
        <UserAvatar src={session.user?.image} alt={session.user?.name || 'User'} size={24} />
        <span className="text-lg">{session.user?.name}</span>
        {/* {session.user?.email && <CoinDisplay email={session.user.email} />} */}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-muted rounded-md shadow-lg py-1">
          <Link href="/submit-track" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary" onClick={handleLinkClick}>
            Submit Track
          </Link>
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary" onClick={handleLinkClick}>
            Dashboard
          </Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary" onClick={handleLinkClick}>
            Profile
          </Link>
          <button 
            onClick={() => {
              signOut()
              handleLinkClick()
            }}
            className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}