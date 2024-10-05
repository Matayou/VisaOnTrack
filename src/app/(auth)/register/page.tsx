import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Join VisaOnTrack
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose how you want to use VisaOnTrack and start your journey towards a hassle-free visa process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">I need visa support</h3>
            <p className="text-gray-600 mb-6">Register as a visa seeker to get expert guidance and support for your visa application.</p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              <Link href="/register/visa-seeker">Register as Visa Seeker</Link>
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">I'm a service provider</h3>
            <p className="text-gray-600 mb-6">Register as a service provider to offer your expertise and services to visa seekers.</p>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/register/provider">Register as Service Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}