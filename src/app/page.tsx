import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-6">
            Simplify Your Visa Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VisaOnTrack: Your trusted companion for navigating the complex world of long-term visas in Thailand. We make the process smooth, transparent, and stress-free.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/register/visa-seeker">Find Visa Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register/provider">Join as Service Provider</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Expert Guidance</h3>
            <p className="text-gray-600">Our team of experienced professionals will guide you through every step of the visa application process.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Streamlined Process</h3>
            <p className="text-gray-600">We've simplified the complex visa application process, saving you time and reducing stress.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Personalized Support</h3>
            <p className="text-gray-600">Get personalized assistance tailored to your unique situation and visa requirements.</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 text-center">
            Why Choose VisaOnTrack?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Traditional Visa Services</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Often involve lengthy paperwork and bureaucracy</li>
                <li>Limited transparency in the process</li>
                <li>One-size-fits-all approach</li>
                <li>Potential language barriers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">VisaOnTrack Advantage</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Streamlined digital process with minimal paperwork</li>
                <li>Real-time updates and complete transparency</li>
                <li>Tailored solutions for your specific needs</li>
                <li>Multilingual support and cultural understanding</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">How long does the visa process take with VisaOnTrack?</h3>
              <p className="text-gray-600">The duration varies depending on the type of visa, but our streamlined process typically reduces waiting times by 30-50% compared to traditional methods.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What types of visas do you support?</h3>
              <p className="text-gray-600">We support all long-term visa types for Thailand, including work visas, retirement visas, student visas, and marriage visas.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How does VisaOnTrack ensure the security of my personal information?</h3>
              <p className="text-gray-600">We use state-of-the-art encryption and security measures to protect your data. Our systems are regularly audited and comply with international data protection standards.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have successfully obtained their long-term visas with VisaOnTrack.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}