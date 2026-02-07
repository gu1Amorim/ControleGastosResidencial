import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pessoas } from './pages/Pessoas';
import { Categorias } from './pages/Categorias';
import { Transacoes } from './pages/Transacoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O Layout é o "pai", ele contém o menu lateral */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pessoas" element={<Pessoas />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="transacoes" element={<Transacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;