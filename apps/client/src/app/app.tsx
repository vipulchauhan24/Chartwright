import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

const ChartEditor = lazy(() => import('./charteditor'));
const Home = lazy(() => import('./home'));
const PageNotFound = lazy(() => import('./pageNotFound'));
const AuthGaurd = lazy(() => import('./authGaurd'));
const Toaster = lazy(() =>
  import('react-hot-toast').then((mod) => ({ default: mod.Toaster }))
);

const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

export function App() {
  const userSignin = async (user: User) => {
    try {
      const loginPayload = {
        email: user.profile.email,
        cognito_id: user.profile.sub,
        created_date: new Date().toISOString(),
      };
      const { userLogin } = await import('../service/userAPI');
      await userLogin(loginPayload);
    } catch (error) {
      console.error(error);
    }
  };

  const cognitoAuthConfig = {
    authority: VITE_AUTHORITY,
    client_id: VITE_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: VITE_SCOPE,
    onSigninCallback: (user: User | undefined) => {
      if (user) {
        userSignin(user);
      }
    },
  };

  const ChartRoutes = () => {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <AuthGaurd>
              <Home />
            </AuthGaurd>
          }
        />
        <Route
          path="/chart/:id?"
          element={
            <AuthGaurd>
              <ChartEditor />
            </AuthGaurd>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
  };

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <DevTools />
      <Toaster position="bottom-center" reverseOrder={false} />
      <ChartRoutes />
    </AuthProvider>
  );
}

export default App;
