import * as ReactDOM from 'react-dom/client';
import { lazy } from 'react';
const App = lazy(() => import('./app/embeddedCharts'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
