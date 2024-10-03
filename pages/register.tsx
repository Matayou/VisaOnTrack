import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordInput } from '@/components/ui/PasswordInput'

type UserType = 'VISA_SEEKER' | 'SERVICE_PROVIDER'

export default function Register() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, userType }),
      })

      if (response.ok) {
        router.push('/signin?registered=true')
      } else {
        const data = await response.json()
        setError(data.message || 'An error occurred during registration')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - VisaOnTrack</title>
        <meta name="description" content="Register for VisaOnTrack" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <Typography variant="h2" className="text-center">Join VisaOnTrack</Typography>
            {!userType && (
              <Typography variant="p" className="text-center text-muted-foreground">
                Choose how you want to use VisaOnTrack
              </Typography>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!userType ? (
              <div className="space-y-4">
                <Button
                  onClick={() => setUserType('VISA_SEEKER')}
                  className="w-full"
                  variant="outline"
                >
                  I'm a visa seeker
                </Button>
                <Button
                  onClick={() => setUserType('SERVICE_PROVIDER')}
                  className="w-full"
                  variant="outline"
                >
                  I'm a service provider
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
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
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Typography variant="p" className="text-sm text-muted-foreground">
              Already have an account?{' '}
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