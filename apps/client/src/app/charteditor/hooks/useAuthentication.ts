import { useAuth } from 'react-oidc-context';

function useAuthentication() {
  const auth = useAuth();

  return {
    isAuthenticated: auth.isAuthenticated,
    email: auth.user?.profile.email,
    initials: auth.user?.profile.email?.charAt(0),
    cognito_id: auth.user?.profile.sub,
    signinRedirect: auth.signinRedirect,
    signoutRedirect: auth.signoutRedirect,
  };
}

export default useAuthentication;
