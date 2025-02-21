import { Route, Routes } from 'react-router-dom';
import ChartEditor from './charteditor';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChartEditor />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
