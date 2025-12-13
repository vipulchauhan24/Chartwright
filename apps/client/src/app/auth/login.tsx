import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

function Login() {
  const { signinRedirect } = useAuth();

  useEffect(() => {
    signinRedirect();
  }, [signinRedirect]);

  return null;
}

export default React.memo(Login);
