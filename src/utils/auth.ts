import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function authRedirect(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }

  if (!session.user.profileCompleted && context.resolvedUrl !== '/dashboard/complete-profile') {
    console.log('authRedirect - Profile not completed, redirecting to /dashboard/complete-profile')
    return {
      redirect: {
        destination: '/dashboard/complete-profile',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export async function publicRedirect(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export async function verifyEmailRedirect(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }

  if (session.user.profileCompleted) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
