import Link from 'next/link'
import UserAccount from './UserAccount'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            Improve
          </Link>
          <Link href="/tracks" className="hover:text-gray-300">
            Tracks
          </Link>
        </div>
        <UserAccount />
      </div>
    </nav>
  )
}