import { Route, Routes } from 'react-router-dom';
import ChartEditor from './charteditor';
import RenderChart from './renderChart';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChartEditor />} />
        <Route path="/chart/render/:id" element={<RenderChart />} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
