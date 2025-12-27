import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

const ChartEditor = lazy(() => import('./charteditor'));
const Home = lazy(() => import('./home'));
const PageNotFound = lazy(() => import('./pageNotFound'));
const AuthGaurd = lazy(() => import('./authGaurd'));
const Login = lazy(() => import('./auth/login'));
const AuthTokenSync = lazy(() => import('./auth/tokenSync'));
const AuthCallback = lazy(() => import('./auth/callback'));

const Toaster = lazy(() =>
  import('react-hot-toast').then((mod) => ({ default: mod.Toaster }))
);

const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

export function App() {
  const cognitoAuthConfig = {
    authority: VITE_AUTHORITY,
    client_id: VITE_CLIENT_ID,
    redirect_uri: window.location.origin + '/auth/callback',
    response_type: 'code',
    scope: VITE_SCOPE,
    automaticSilentRenew: true,
  };

  const ChartRoutes = () => {
    return (
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGaurd>
              <Home />
            </AuthGaurd>
          }
        />
        <Route
          path="/chart/:chart_id?"
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
      <AuthTokenSync />
      <DevTools />
      <Toaster position="bottom-center" reverseOrder={false} />
      <ChartRoutes />
    </AuthProvider>
  );
}

export default App;
