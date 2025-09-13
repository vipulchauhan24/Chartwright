import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { userLogin } from '../service/userAPI';
import {
  fetchFromLocalStorage,
  removeFromSessionStorage,
  storeInSessionStorage,
} from './charteditor/utils/lib';
import {
  LOCAL_STORAGE_KEYS,
  SESSION_STORAGE_KEYS,
} from './charteditor/utils/constants';
import { CWSolidButton, CWSpinner } from '@chartwright/core-components';

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

  const guestLogin = useCallback(() => {
    setIsUserAuthenticated(true);
    storeInSessionStorage(SESSION_STORAGE_KEYS.IS_GHOST_USER, 'true');
  }, []);

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
    } else {
      // const isGuestUser = fetchFromSessionStorage(
      //   SESSION_STORAGE_KEYS.IS_GHOST_USER
      // );
      // if (isGuestUser === 'true') {
      //   setIsUserAuthenticated(true);
      //   removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
      // }
      guestLogin();
    }

    setIsLoading(false);
  }, [
    auth.isAuthenticated,
    auth.user?.profile.email,
    auth.user?.profile.sub,
    guestLogin,
  ]);

  useEffect(() => {
    setIsLoading(auth.isLoading);
  }, [auth.isLoading]);

  // const useLogin = useCallback(() => {
  //   auth.signinRedirect();
  // }, [auth]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <CWSpinner />
      </div>
    );
  }

  // if (!isUserAuthenticated) {
  //   return (
  //     <div className="h-full w-full flex items-center justify-center bg-app">
  //       <div className="flex gap-2 flex-col">
  //         <CWSolidButton label="Guest login" onClick={guestLogin} />
  //         <CWSolidButton label="User login" onClick={useLogin} />
  //       </div>
  //     </div>
  //   );
  // }

  return children;
}

export default AuthGaurd;
