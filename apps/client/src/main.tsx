import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import 'tippy.js/dist/tippy.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryPage from './app/errorBoundaryPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ErrorBoundary fallback={<ErrorBoundaryPage />}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
