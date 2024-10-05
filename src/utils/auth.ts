import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'

export async function authRedirect(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  console.log('authRedirect - Session:', session)

  if (!session) {
    console.log('authRedirect - No session, redirecting to /')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!session.user.emailVerified && context.resolvedUrl !== '/profile') {
    console.log('authRedirect - Email not verified, redirecting to /profile')
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }
  }

  console.log('authRedirect - Authenticated and verified, proceeding')
  return {
    props: { session }
  }
}

export async function publicRedirect(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  console.log('publicRedirect - Session:', session)

  if (session) {
    if (session.user.emailVerified) {
      console.log('publicRedirect - Authenticated and verified, redirecting to /dashboard')
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
    } else {
      console.log('publicRedirect - Authenticated but not verified, redirecting to /profile')
      return {
        redirect: {
          destination: '/profile',
          permanent: false,
        },
      }
    }
  }

  console.log('publicRedirect - No session, proceeding')
  return {
    props: {},
  }
}

export async function verifyEmailRedirect(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  console.log('verifyEmailRedirect - Session:', session)

  if (!session) {
    console.log('verifyEmailRedirect - No session, redirecting to /')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (session.user.emailVerified) {
    console.log('verifyEmailRedirect - Email already verified, redirecting to /profile')
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }
  }

  console.log('verifyEmailRedirect - Proceeding to verify email page')
  return {
    props: { session }
  }
}