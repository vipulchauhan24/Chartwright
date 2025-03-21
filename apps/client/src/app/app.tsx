import { Route, Routes, useNavigate } from 'react-router-dom';
import ChartEditor from './charteditor';
import RenderChart from './renderChart';
import { useAuth } from 'react-oidc-context';
import CWButton from './components/button';
import { useEffect } from 'react';
import Spinner from './components/spinner';

export function App() {
  const auth = useAuth();

  const continueAsGuest = () => {
    console.log('continueAsGuest');
  };

  const continueAsUser = () => {
    auth.signinRedirect();
  };

  if (auth.isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-primary-background">
        <div className="flex gap-2">
          <CWButton label="Continue as guest" onClick={continueAsGuest} />
          <CWButton label="Continue as user" onClick={continueAsUser} />
        </div>
      </div>
    );
  }

  const RedirectToChartUrl = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate('/chart');
    });

    return null;
  };

  return (
    <Routes>
      <Route path="/" element={<RedirectToChartUrl />} />
      <Route path="/chart" element={<ChartEditor />} />
      <Route path="/chart/render/:id" element={<RenderChart />} />
    </Routes>
  );
}

export default App;
