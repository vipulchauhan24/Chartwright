import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { fetchFromLocalStorage } from './charteditor/utils/lib';
import { LOCAL_STORAGE_KEYS } from './charteditor/utils/constants';
import { CWSpinner } from '@chartwright/ui-components';
import { useParams } from 'react-router-dom';
import { User } from 'oidc-client-ts';

function AuthGaurd({
  children,
  serverUserSigninInProgress,
  setServerUserSigninInProgress,
  userSignin,
}: {
  children: React.ReactNode;
  serverUserSigninInProgress: boolean;
  setServerUserSigninInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  userSignin: (user: User) => Promise<void>;
}) {
  const { chart_id } = useParams();
  const { isAuthenticated, user, signinRedirect } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (
        !fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID) &&
        !serverUserSigninInProgress
      ) {
        setServerUserSigninInProgress(true);
        userSignin(user as User);
      }
    } else if (!isAuthenticated && chart_id) {
      signinRedirect();
    } else if (!isAuthenticated && !chart_id) {
      setServerUserSigninInProgress(false); //Guest.
    }
  }, [
    chart_id,
    isAuthenticated,
    serverUserSigninInProgress,
    setServerUserSigninInProgress,
    signinRedirect,
    user,
    userSignin,
  ]);

  if (serverUserSigninInProgress) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <CWSpinner />
      </div>
    );
  }

  return children;
}

export default React.memo(AuthGaurd);
