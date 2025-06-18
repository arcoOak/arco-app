import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router para la navegación

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <h2 style={{ color: '#fff', marginBottom: '30px' }}>Mi Aplicación</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
              Inicio
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/productos" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
              Productos
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/clientes" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
              Clientes
            </Link>
          </li>
          {/* Agrega más enlaces según tus rutas */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;