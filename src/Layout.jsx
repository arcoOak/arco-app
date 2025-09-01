import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useCarrito } from "./context/CartContext";
import VistaCarrito from "./components/cart/VistaCarrito";
import ModalCarrito from "./components/cart/ModalCarrito";

import {useNotificaciones} from './context/NotificacionesContext';
import VistaNotificaciones from "./components/notificaciones/VistaNotificaciones";
import ModalNotificaciones from "./components/notificaciones/ModalNotificaciones";

import './css/Wrapper.css'; // Importa tu CSS para el layout

import Navbar from "./pages/Navbar";

export default function Layout() {

    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const { elementosCarrito, totalItems } = useCarrito(); // Obtiene los elementos del carrito desde el contexto
    const [carritoVisible, setCarritoVisible] = useState(false); // Estado para controlar la visibilidad del carrito

    const { notificaciones, noVistasCount, marcarComoVista } = useNotificaciones();
    const [notificacionesVisible, setNotificacionesVisible] = useState(false);

    const menuItems = [
        { icon: "bx bxs-home-alt-2", label: "Inicio", path: "/" },
        { icon: "bx bxs-calendar-alt", label: "Espacios", path: "/espacios" },
        { icon: "bx bxs-qr-scan", label: "QR", path: "/qr" },
        { icon: "bx bxs-store", label: "Comercios", path: "/comercios" },
        { icon: "bx bxs-user", label: "Perfil", path: "/perfil" },
    ];

    // Cambia activeIndex cuando cambia la URL
    useEffect(() => {
        const index = menuItems.findIndex(item => item.path === location.pathname);
        if (index !== -1) setActiveIndex(index);
    }, [location.pathname]);

    return (
        <div className="app-container">
            <div className="floating-modals-container">
                <ModalCarrito visible={totalItems > 0} cantidad={totalItems} onPress={() => setCarritoVisible(!carritoVisible)} />
                <ModalNotificaciones cantidadNoVistas={noVistasCount} visible={notificaciones.length > 0} onPress={() => setNotificacionesVisible(!notificacionesVisible)} />
            </div>

            {carritoVisible && 
                (<VistaCarrito onClose={() => setCarritoVisible(false)}></VistaCarrito>)
            }

            {notificacionesVisible && 
                (<VistaNotificaciones onClose={() => setNotificacionesVisible(false)}></VistaNotificaciones>)
            }

            <Navbar/>

            <div className="main-content">
                <Outlet />
            </div>

            <div className="wrapper">
                <ul>
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={activeIndex === index ? "active" : ""}
                        >
                            <Link to={item.path}>
                                <i className={`${item.icon} ${item.size || 'bx-md'}`} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    <div className="indicator" />
                </ul>
            </div>

            <footer className={`footer`}>
                    <p><a href="#" onClick={() => navigate('/PrivacyPolicy')}>Política de Privacidad</a> | <a href="#" onClick={() => navigate('/TermsOfUse')}>Términos de Uso</a> | <a href="#" onClick={() => navigate('/FAQPage')} >FAQs</a></p>
                    <p>© 2025 Oak Tree C.A.</p>
                    <p>Todos los derechos reservados.</p>
                </footer>
        </div>
    );
}
