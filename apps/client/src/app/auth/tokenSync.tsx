import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { api } from '../api-client';

function AuthTokenSync() {
  const auth = useAuth();

  useEffect(() => {
    api.setAccessToken(auth.user?.access_token ?? null);
  }, [auth.user?.access_token]);

  return null;
}

export default React.memo(AuthTokenSync);
