import { Route, Routes } from 'react-router-dom';
import ChartEditor from './charteditor';
import RenderChart from './renderChart';
import { AuthProvider } from 'react-oidc-context';
import Home from './home';
import AuthGaurd from './authGaurd';
import { User } from 'oidc-client-ts';
import axios from 'axios';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';
const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

export function App() {
  const userSignin = async (user: User) => {
    try {
      const loginPayload = {
        email: user.profile.email,
        cognito_id: user.profile.sub,
        created_date: new Date().toISOString(),
      };
      await axios.post('/api/user-signin', loginPayload);
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
          path="/chart"
          element={
            <AuthGaurd>
              <ChartEditor />
            </AuthGaurd>
          }
        />
        <Route path="/chart/render/:id" element={<RenderChart />} />
      </Routes>
    );
  };

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <DevTools />
      <ChartRoutes />
    </AuthProvider>
  );
}

export default App;
