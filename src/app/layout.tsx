import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "../components/ui/toaster"
import { Providers } from "../components/Providers"
import { HeaderNavigation } from "../components/HeaderNavigation"
import Footer from "../components/Footer"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VisaOnTrack',
  description: 'Simplify your visa journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderNavigation />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}