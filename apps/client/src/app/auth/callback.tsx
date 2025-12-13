// AuthCallback.tsx
import { useAuth } from 'react-oidc-context';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'oidc-client-ts';
import toast from 'react-hot-toast';
import { CWSpinner } from '@chartwright/ui-components';

export default function AuthCallback() {
  const { isLoading, isAuthenticated, user, error } = useAuth();
  const navigate = useNavigate();
  const hasCalledRef = useRef(false);

  const serverLogin = useCallback(
    async (user: User) => {
      try {
        if (hasCalledRef.current) return;
        const loginPayload = {
          email: user.profile.email,
          cognitoId: user.profile.sub,
          createdDate: new Date().toISOString(),
        };
        const { userLogin } = await import('../../service/userAPI');
        await userLogin(loginPayload);
        navigate('/');
      } catch {
        console.log('User signin failed');
        toast.error('User login failed!');
        navigate('/login');
      } finally {
        hasCalledRef.current = true;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      navigate('/login');
      return;
    }

    if (isAuthenticated && user?.access_token) {
      serverLogin(user);
    }
  }, [isLoading, isAuthenticated, user, error, navigate, serverLogin]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <CWSpinner />
    </div>
  );
}
