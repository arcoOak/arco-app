// src/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
// Assuming you've moved the CSS into Navbar.css
import './Navbar.css'; // Make sure this path is correct relative to Navbar.jsx

import logo from '../img/logo.png'; // Importa tu logo
import logoDark from '../img/logo-dark.png'; // Importa tu logo oscuro

import {useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

// Es una buena práctica definir constantes que no dependen del estado o props fuera del componente.
// Esto evita que se recreen en cada renderizado.
const ownItems = [
    { name: 'Inicio', icon: 'home', path: '/' },
    { name: 'Mis Reservas', icon: 'calendar_month', path: '/reservas' },
    { name: 'Mis Servicios', icon: 'work', path: '/mis-servicios' },
    { name: 'Mis Compras', icon: 'shopping_cart', path: '/compras' },
    
];

const menuItems = [
    { name: 'Espacios', icon: 'location_on', path: '/espacios' },
    { name: 'QR', icon: 'qr_code_scanner', path: '/qr' },
    { name: 'Noticias', icon: 'article', path: '/noticias' },
    { name: 'Comercios', icon: 'storefront', path: '/comercios' },
    { name: 'Servicios', icon: 'build', path: '/servicios' },
    { name: 'Beneficiarios', icon: 'group', path: '/perfil/beneficiarios' },
    { name: 'Ajustes', icon: 'settings', path: '/perfil' },
];



const Navbar = () => {

    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed based on your HTML

    const [activeMenuItem, setActiveMenuItem] = useState('Inicio'); // State for active menu item

    const { isDarkTheme, toggleTheme, logo } = useAuth();

   

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarCollapsed(prevState => !prevState);
    };

    // Function to update theme icon based on sidebar state and theme
    const getThemeIcon = () => {
        return isDarkTheme ? 'light_mode' : 'dark_mode'; 
    };

    // Effect to handle sidebar collapse on window resize (optional, but good for responsiveness)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarCollapsed(false);
            } else { 
                setIsSidebarCollapsed(true);
            } 
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSeleccionarBoton = (e, item) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto de la etiqueta <a>
        setActiveMenuItem(item.name);
        navigate(item.path);

        // En pantallas pequeñas, el sidebar es un overlay, así que lo cerramos tras la selección.
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    };


    return (
        <>

            <div className="titleHome">
                <div className="titleHomeSide">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <i className='fa fa-solid fa-bars'></i>
                    </button>
                </div>
            </div>


            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {/* Make sure 'logo.png' is in your public folder or imported correctly */}
                    <img src={logo} alt="Logo de Arco App" className="header-logo" />
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* Search Form */}
                    <form action="#" className="search-form" onClick={() => {
                        if (isSidebarCollapsed) {
                            setIsSidebarCollapsed(false);
                            // You might need a ref here to focus the input directly in React
                            // For now, it will just expand.
                        }
                    }}>
                        <span className="material-symbols-rounded">search</span>
                        <input type="search" placeholder="Buscar..." required />
                    </form>


                    {/* Own Sidebar Menu */}

                    <ul className='menu-list'>
                    {ownItems.map((item) => (
                        <li className="menu-item own" key={item.name}>
                            <a
                                href="#"
                                className={`menu-link ${activeMenuItem === item.name ? 'active' : ''}`}
                                onClick={(e) => handleSeleccionarBoton(e, item)}
                            >
                                <span className="material-symbols-rounded">{item.icon}</span>
                                <span className="menu-label">{item.name}</span>
                            </a>
                        </li>
                    ))}
                    </ul>

                    <hr />

                    {/* Sidebar Menu */}
                    <ul className="menu-list">
                        {menuItems.map((item) => (
                            <li className="menu-item" key={item.name}>
                                <a
                                    href="#"
                                    className={`menu-link ${activeMenuItem === item.name ? 'active' : ''}`}
                                    onClick={(e) => handleSeleccionarBoton(e, item)}
                                >
                                    <span className="material-symbols-rounded">{item.icon}</span>
                                    <span className="menu-label">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sidebar Footer */}
                <div className="sidebar-footer">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        <div className="theme-label">
                            <span className="theme-icon material-symbols-rounded">{getThemeIcon()}</span>
                            <span className="theme-text">Modo Oscuro</span>
                        </div>
                        <div className="theme-toggle-track">
                            <div className="theme-toggle-indicator"></div>
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;