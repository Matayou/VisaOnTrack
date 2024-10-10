import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose your account type
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select the type of account you want to create
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          <div className="space-y-6">
            <div>
              <Button asChild className="w-full">
                <Link href="/register/visa-seeker">Register as Visa Seeker</Link>
              </Button>
            </div>
            <div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/register/provider">Register as Service Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
