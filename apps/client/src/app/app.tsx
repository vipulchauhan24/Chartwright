import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import { EMBEDDABLES } from './charteditor/utils/lib';
import toast from 'react-hot-toast';

const ChartEditor = lazy(() => import('./charteditor'));
const Home = lazy(() => import('./home'));
const EmbeddedCharts = lazy(() => import('./embeddedCharts'));
const PageNotFound = lazy(() => import('./pageNotFound'));
const AuthGaurd = lazy(() => import('./authGaurd'));
const Login = lazy(() => import('./auth/login'));
const AuthTokenSync = lazy(() => import('./auth/tokenSync'));

const Toaster = lazy(() =>
  import('react-hot-toast').then((mod) => ({ default: mod.Toaster }))
);

const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

export function App() {
  const userSignin = async (user: User) => {
    try {
      const loginPayload = {
        email: user.profile.email,
        cognitoId: user.profile.sub,
        createdDate: new Date().toISOString(),
      };
      const { userLogin } = await import('../service/userAPI');
      await userLogin(loginPayload);
    } catch {
      console.log('User signin failed');
      toast.error('User login failed!');
    }
  };

  const cognitoAuthConfig = {
    authority: VITE_AUTHORITY,
    client_id: VITE_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: VITE_SCOPE,
  };

  const ChartRoutes = () => {
    return (
      <Routes>
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
        <Route
          path={`embed/${EMBEDDABLES.STATIC_IMAGE}/:embed_id`}
          element={
            <AuthGaurd>
              <EmbeddedCharts />
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
