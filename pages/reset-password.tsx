import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from 'next/head'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordInput } from "@/components/ui/PasswordInput"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    if (router.isReady && !token) {
      setError("Invalid or missing reset token")
    }
  }, [router.isReady, token])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
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
        <title>Reset Password - VisaOnTrack</title>
        <meta name="description" content="Reset your VisaOnTrack password" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <Typography variant="h2" className="text-center">Reset Password</Typography>
            <Typography variant="p" className="text-center text-muted-foreground">
              Enter your new password
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
            {!error && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                  id="password"
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={isLoading || !token}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
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