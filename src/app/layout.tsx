import React from 'react'
import { Inter, Poppins } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { HeaderNavigation } from '@/components/HeaderNavigation'
import Footer from '@/components/Footer'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-poppins' })

export const metadata = {
  title: 'VisaOnTrack',
  description: 'Simplify your visa application process',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Providers>
          <HeaderNavigation />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}