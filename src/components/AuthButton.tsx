'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div>
      Not signed in <br />
      <Link href="/auth/sign-in">Sign in</Link> | <Link href="/auth/sign-up">Sign up</Link>
    </div>
  )
}