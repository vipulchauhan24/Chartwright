import { useAuth } from 'react-oidc-context';
import CWLink from '../../components/link';
import CWButton from '../../components/button';
import { LogIn, LogOut } from 'lucide-react';
import { removeFromLocalStorage } from '../utils/lib';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const { VITE_CLIENT_ID } = import.meta.env;

function AppHeader() {
  const auth = useAuth();

  const redirectToLoginPage = () => {
    auth.signinRedirect();
  };

  const logout = async () => {
    removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    await auth.signoutRedirect({
      extraQueryParams: {
        client_id: VITE_CLIENT_ID,
        logout_uri: window.location.origin,
      },
    });
  };

  return (
    <header className="h-[4.5rem] border-b border-border py-2 px-4 flex items-center justify-between">
      <CWLink
        href="/"
        nohover
        label={<img src="/cw-logo.png" alt="chart wright" className="h-12" />}
      />
      <div>
        {auth.isAuthenticated ? (
          <CWButton
            primary
            label={
              <>
                <LogOut className="size-4" aria-hidden={true} /> Sign out
              </>
            }
            onClick={logout}
          />
        ) : (
          <CWButton
            primary
            label={
              <>
                <LogIn className="size-4" aria-hidden={true} /> Sign in
              </>
            }
            onClick={redirectToLoginPage}
          />
        )}
      </div>
    </header>
  );
}

export default AppHeader;
