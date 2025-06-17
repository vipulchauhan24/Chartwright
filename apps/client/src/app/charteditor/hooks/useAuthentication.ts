import { useAuth } from 'react-oidc-context';

function useAuthentication() {
  const auth = useAuth();

  return {
    isAuthenticated: auth.isAuthenticated,
    email: auth.user?.profile.email,
    cognito_id: auth.user?.profile.sub,
  };
}

export default useAuthentication;
