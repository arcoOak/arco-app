
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header'; 
import Footer from './Footer'; 

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header /> {/* Renderiza el encabezado si lo tienes */}
        <main style={{ flexGrow: 1, padding: '20px' }}>
          {children} {/* Aquí se renderiza el contenido de tu página */}
        </main>
        <Footer /> {/* Renderiza el pie de página si lo tienes */}
      </div>
    </div>
  );
};

export default Layout;