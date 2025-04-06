import { useAuth } from 'react-oidc-context';
import CWLink from '../../components/link';
import CWButton from '../../components/button';
import { LogIn, LogOut } from 'lucide-react';

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
          <CWButton
            label={
              <span className="flex items-center gap-1">
                Sign out <LogOut className="size-4" aria-hidden={true} />
              </span>
            }
            onClick={logout}
          />
        ) : (
          <CWButton
            label={
              <span className="flex items-center gap-1">
                Sign in <LogIn className="size-4" aria-hidden={true} />
              </span>
            }
            onClick={redirectToLoginPage}
          />
        )}
      </div>
    </header>
  );
}

export default AppHeader;
