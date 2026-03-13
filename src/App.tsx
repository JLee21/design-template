import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Showcase from './handoff/new/Showcase';
import Instructions from './pages/Blank';
import DatabaseCreate from './pages/DatabaseCreate';
import Audit from './pages/Audit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Instructions />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/database-create" element={<DatabaseCreate />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
