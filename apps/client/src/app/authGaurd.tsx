import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import Spinner from './components/spinner';
import CWButton from './components/button';

function AuthGaurd({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsUserAuthenticated(auth.isAuthenticated);
    const isGuestUser = sessionStorage.getItem('isGuestUser');
    if (isGuestUser === 'true') {
      setIsUserAuthenticated(true);
    }
    setIsLoading(false);
  }, [auth.isAuthenticated]);

  useEffect(() => {
    setIsLoading(auth.isLoading);
  }, [auth.isLoading]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    const continueAsGuest = () => {
      setIsUserAuthenticated(true);
      sessionStorage.setItem('isGuestUser', 'true');
    };

    const continueAsUser = () => {
      auth.signinRedirect();
    };

    return (
      <div className="h-full w-full flex items-center justify-center bg-primary-background">
        <div className="flex gap-2">
          <CWButton label="Continue as guest" onClick={continueAsGuest} />
          <CWButton label="Continue as user" onClick={continueAsUser} />
        </div>
      </div>
    );
  }

  return children;
}

export default AuthGaurd;
