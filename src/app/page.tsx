import Link from 'next/link'
import dynamic from 'next/dynamic'

const AuthButton = dynamic(() => import('../components/AuthButton'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Improve</h1>
      <AuthButton />
      <nav>
        <ul>
          <li><Link href="/tracks">View Tracks</Link></li>
          <li><Link href="/submit">Submit Track</Link></li>
          <li><Link href="/protected">Protected Page</Link></li>
        </ul>
      </nav>
    </main>
  )
}