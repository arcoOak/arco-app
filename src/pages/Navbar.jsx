// src/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
// Assuming you've moved the CSS into Navbar.css
import '../css/Navbar.css'; // Make sure this path is correct relative to Navbar.jsx

const Navbar = () => {

    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed based on your HTML
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard'); // State for active menu item

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarCollapsed(prevState => !prevState);
    };

    // Function to toggle theme
    const toggleTheme = () => {
        setIsDarkTheme(prevState => !prevState);
    };

    // Function to update theme icon based on sidebar state and theme
    const getThemeIcon = () => {
        if (isSidebarCollapsed) {
            return isDarkTheme ? 'light_mode' : 'dark_mode';
        }
        return 'dark_mode'; // Always dark_mode when sidebar is expanded
    };

    // Effect for initial theme setup and updating body class
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme based on local storage or system preference
        const initialTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
        setIsDarkTheme(initialTheme);
        document.body.classList.toggle('dark-theme', initialTheme);

        // Handle sidebar collapsed state on larger screens initially
        if (window.innerWidth > 768) {
            setIsSidebarCollapsed(false);
        }
    }, []); // Run once on component mount

    // Effect to update body class when isDarkTheme changes
    useEffect(() => {
        document.body.classList.toggle('dark-theme', isDarkTheme);
    }, [isDarkTheme]);

    // Effect to handle sidebar collapse on window resize (optional, but good for responsiveness)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarCollapsed(false);
            } else {
                // You might want to re-collapse on small screens if it's currently expanded
                // setIsSidebarCollapsed(true); // Uncomment if you want it to collapse automatically
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleNotification = () => {
        navigate(`notifications`)
    };

    return (
        <>

            <div className="titleHome">
                <div className="titleHomeSide">
                    {/* <img src="../src/img/perfil.jpg" alt="Logo" className="logo" />
                    <div className="text-left">
                        <p>Bienvenido!</p>
                        <h3>Johny Roria</h3>
                    </div> */}
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <span className="material-symbols-rounded">menu</span>
                    </button>
                </div>
                <div
                    className="titleNotification"
                    onClick={handleNotification}
                >
                    <div className="notification"></div>
                    <i className='bx bx-bell'></i>
                </div>
            </div>


            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {/* Make sure 'logo.png' is in your public folder or imported correctly */}
                    <img src="../src/img/logo.png" alt="CodingNepal" className="header-logo" />
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

                    {/* Sidebar Menu */}
                    <ul className="menu-list">
                        {[
                            { name: 'Inicio', icon: 'home' },
                            { name: 'Mis Reservas', icon: 'calendar_month' },
                            { name: 'Favoritos', icon: 'star' },
                            { name: 'Comercios', icon: 'storefront' },
                            { name: 'Beneficiarios', icon: 'group' },
                            { name: 'Ajustes', icon: 'settings' },
                        ].map((item) => (
                            <li className="menu-item" key={item.name}>
                                <a
                                    href="#"
                                    className={`menu-link ${activeMenuItem === item.name ? 'active' : ''}`}
                                    onClick={() => setActiveMenuItem(item.name)}
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