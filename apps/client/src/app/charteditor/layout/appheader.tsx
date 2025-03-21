import { useAuth } from 'react-oidc-context';
import CWLink from '../../components/link';
import CWButton from '../../components/button';

const { VITE_CLIENT_ID } = import.meta.env;

function AppHeader() {
  const auth = useAuth();

  const redirectToLoginPage = () => {
    auth.signinRedirect();
  };

  const logout = async () => {
    await auth.signoutRedirect({
      extraQueryParams: {
        client_id: VITE_CLIENT_ID,
        logout_uri: window.location.origin,
      },
    });
  };

  return (
    <header className="h-[4.5rem] border-b border-primary-border py-2 px-4 flex items-center justify-between">
      <CWLink
        href="/"
        nohover
        label={<img src="/cw-logo.png" alt="chart wright" className="h-12" />}
      />
      <div>
        {auth.isAuthenticated ? (
          <CWButton label="Sign out" onClick={logout} />
        ) : (
          <CWButton label="Sign in" onClick={redirectToLoginPage} />
        )}
      </div>
    </header>
  );
}

export default AppHeader;
