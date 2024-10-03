import React, { useState } from "react"
import Head from 'next/head'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
      } else {
        setError(data.message || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Forgot Password - VisaOnTrack</title>
        <meta name="description" content="Reset your VisaOnTrack password" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <Typography variant="h2" className="text-center">Forgot Password</Typography>
            <Typography variant="p" className="text-center text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </Typography>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Typography variant="p" className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}