import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordInput } from '@/components/ui/PasswordInput'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - VisaOnTrack</title>
        <meta name="description" content="Sign in to VisaOnTrack" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <Typography variant="h2" className="text-center">Sign in to VisaOnTrack</Typography>
            <Typography variant="p" className="text-center text-muted-foreground">
              Enter your email and password to access your account
            </Typography>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {router.query.registered && (
              <Alert variant="default" className="mb-4">
                <AlertDescription>Registration successful! Please sign in.</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <PasswordInput
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Typography variant="p" className="text-sm text-muted-foreground">
              <Link href="/forgot-password" className="text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </Typography>
            <Typography variant="p" className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}