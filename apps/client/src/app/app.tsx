import { Route, Routes } from 'react-router-dom';
import ChartEditor from './charteditor';
import RenderChart from './renderChart';
import { AuthProvider } from 'react-oidc-context';
import Home from './home';
import AuthGaurd from './authGaurd';

const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

export function App() {
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
      <ChartRoutes />
    </AuthProvider>
  );
}

export default App;
