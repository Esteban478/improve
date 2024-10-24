import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/NavBar'
import AuthProvider from '@/components/AuthProvider'
import { ThemeProvider } from '../components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Improve',
  description: 'Share and critique music tracks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="forest"
            enableSystem={false}
            disableTransitionOnChange
            themes={["light", "dark", "forest", "geek", "girly"]} 
          >
          <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}