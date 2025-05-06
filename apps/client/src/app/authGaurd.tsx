import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import Spinner from './components/spinner';
import CWButton from './components/button';
import { userLogin } from '../service/userAPI';
import {
  fetchFromLocalStorage,
  fetchFromSessionStorage,
  removeFromLocalStorage,
  removeFromSessionStorage,
  storeInSessionStorage,
} from './charteditor/utils/lib';
import {
  LOCAL_STORAGE_KEYS,
  SESSION_STORAGE_KEYS,
} from './charteditor/utils/constants';

function AuthGaurd({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (loginPayload: {
    email: string | undefined;
    cognito_id: string | undefined;
    created_date: string;
  }) => {
    await userLogin(loginPayload);
  };

  useEffect(() => {
    setIsUserAuthenticated(auth.isAuthenticated);
    if (auth.isAuthenticated) {
      removeFromSessionStorage(SESSION_STORAGE_KEYS.IS_GHOST_USER);
      if (!fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID)) {
        const loginPayload = {
          email: auth.user?.profile.email,
          cognito_id: auth.user?.profile.sub,
          created_date: new Date().toISOString(),
        };
        login(loginPayload);
      }
    }
    const isGuestUser = fetchFromSessionStorage(
      SESSION_STORAGE_KEYS.IS_GHOST_USER
    );
    if (isGuestUser === 'true') {
      setIsUserAuthenticated(true);
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    }
    setIsLoading(false);
  }, [auth.isAuthenticated, auth.user?.profile.email, auth.user?.profile.sub]);

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
      storeInSessionStorage(SESSION_STORAGE_KEYS.IS_GHOST_USER, 'true');
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
