import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X } from 'lucide-react'

export default function Homepage() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>VisaOnTrack - Simplify Your Long-Term Thai Visa Process</title>
        <meta name="description" content="VisaOnTrack helps you manage and track your visa application process for long-term stays in Thailand" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-20 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Simplify Your Long-Term Thai Visa Process
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Connect with expert service providers to streamline your long-term visa application for Thailand.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                  Submit a Request
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
                  Become a Provider
                </Button>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="py-20">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Connect with Providers",
                  description: "Submit service requests and receive responses from multiple visa service providers."
                },
                {
                  title: "Document Management",
                  description: "Easily manage and share necessary documents for your visa application process."
                },
                {
                  title: "Real-time Communication",
                  description: "Stay in touch with your chosen service provider throughout the visa application process."
                }
              ].map((feature, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Why VisaOnTrack Section */}
          <section className="py-20 bg-gray-50 rounded-lg">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why VisaOnTrack?</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Traditional Visa Services</h3>
                  <ul className="space-y-4">
                    {[
                      "Limited office hours, resulting in potential delays.",
                      "High costs for in-person consultations.",
                      "Lack of transparency in the application process.",
                      "Manual document handling, prone to errors."
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-6">VisaOnTrack</h3>
                  <ul className="space-y-4">
                    {[
                      "24/7 access to visa application tracking and support.",
                      "Competitive pricing with various service provider options.",
                      "Real-time updates and complete visibility of your application status.",
                      "Secure digital document management and automated checks."
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  question: "What types of Thai visas can VisaOnTrack help with?",
                  answer: "VisaOnTrack specializes in long-term Thai visas, including retirement visas, business visas, education visas, and marriage visas."
                },
                {
                  question: "How does VisaOnTrack connect me with service providers?",
                  answer: "After submitting your visa request, multiple verified service providers can review your case and provide quotes. You can then choose the provider that best fits your needs and budget."
                },
                {
                  question: "Is my personal information secure on VisaOnTrack?",
                  answer: "Yes, we use industry-standard encryption and security measures to protect your personal information. We only share necessary details with your chosen service provider."
                },
                {
                  question: "Can I track the progress of my visa application?",
                  answer: "Absolutely! VisaOnTrack provides real-time updates on your application status, allowing you to track each step of the process."
                },
                {
                  question: "What if I'm not satisfied with the service provider?",
                  answer: "We have a review system in place to ensure quality service. If you're not satisfied, you can contact our support team, and we'll work to resolve any issues promptly."
                }
              ].map((faq, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-blue-50 rounded-lg mb-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Simplify Your Thai Visa Process?
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Join VisaOnTrack today and connect with expert service providers to streamline your long-term visa application.
              </p>
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}