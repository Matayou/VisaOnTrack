import React from 'react'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Layout } from '@/components/Layout'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
        <Providers>
          <Layout>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Layout>
        </Providers>
      </body>
    </html>
  )
}