import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Tag, DollarSign } from 'lucide-react';

export const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar - Menu Lateral */}
      <nav style={{ 
        width: '260px', 
        background: '#2c3e50', 
        color: 'white', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px'}}>💰 My Cash</h2>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={liStyle}>
            <Link to="/" style={linkStyle}><LayoutDashboard size={20} /> Dashboard</Link>
          </li>
          <li style={liStyle}>
            <Link to="/pessoas" style={linkStyle}><Users size={20} /> Pessoas</Link>
          </li>
          <li style={liStyle}>
            <Link to="/categorias" style={linkStyle}><Tag size={20} /> Categorias</Link>
          </li>
          <li style={liStyle}>
            <Link to="/transacoes" style={linkStyle}><DollarSign size={20} /> Transações</Link>
          </li>
        </ul>
      </nav>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '40px', background: '#ecf0f1' }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <Outlet /> {/* Aqui é onde as páginas (Dashboard, Pessoas, etc) vão aparecer! */}
        </div>
      </main>
    </div>
  );
};

// Estilos rápidos para o menu
const liStyle = { marginBottom: '20px' };
const linkStyle = { 
  color: 'white', 
  textDecoration: 'none', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px',
  fontSize: '18px'
};