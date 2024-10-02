import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';

export function withRoleAccess<P extends object>(WrappedComponent: ComponentType<P>, allowedRoles: string[]) {
  return function WithRoleAccess(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) {
        router.push('/api/auth/signin'); // Redirect to login if not authenticated
      } else if (!allowedRoles.includes(session.user?.role as string)) {
        router.push('/unauthorized'); // Redirect to unauthorized page if not allowed
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (!session || !allowedRoles.includes(session.user?.role as string)) {
      return null; // Or you could render a custom unauthorized component
    }

    return <WrappedComponent {...props} />;
  };
}