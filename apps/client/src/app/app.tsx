import { Route, Routes } from 'react-router-dom';
import ChartEditor from './charteditor';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChartEditor />} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
