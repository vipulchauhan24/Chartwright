import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import 'tippy.js/dist/tippy.css';
import { ErrorBoundary } from 'react-error-boundary';
import { lazy } from 'react';
const ErrorBoundaryPage = lazy(() => import('./app/errorBoundaryPage'));
const App = lazy(() => import('./app/app'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <ErrorBoundary fallback={<ErrorBoundaryPage />}>
      <App />
    </ErrorBoundary>
  </BrowserRouter>
);
