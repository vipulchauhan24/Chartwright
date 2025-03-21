import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import 'tippy.js/dist/tippy.css';
import { AuthProvider } from 'react-oidc-context';

const { VITE_AUTHORITY, VITE_CLIENT_ID, VITE_SCOPE } = import.meta.env;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const cognitoAuthConfig = {
  authority: VITE_AUTHORITY,
  client_id: VITE_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: 'code',
  scope: VITE_SCOPE,
};

root.render(
  <AuthProvider {...cognitoAuthConfig}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
