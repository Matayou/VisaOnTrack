import React from 'react'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-poppins">
            Simplify Your Visa Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-inter">
            VisaOnTrack: Your trusted companion for navigating the complex world of long-term visas in Thailand.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/register/visa-seeker">Find Visa Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              <Link href="/register/provider">Join as Service Provider</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {['Expert Guidance', 'Streamlined Process', 'Personalized Support'].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-poppins">{feature}</h3>
              <p className="text-gray-600 font-inter">Our team of experienced professionals will guide you through every step of the visa application process, ensuring a smooth and efficient experience.</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-poppins">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-inter">
            Join thousands of satisfied clients who have successfully obtained their long-term visas with VisaOnTrack.
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}