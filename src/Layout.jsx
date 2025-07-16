import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useCarrito } from "./context/CartContext";
import VistaCarrito from "./components/cart/VistaCarrito";
import ModalCarrito from "./components/cart/ModalCarrito";

import Navbar from "./pages/Navbar";

export default function Layout() {

    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const { elementosCarrito, totalItems } = useCarrito(); // Obtiene los elementos del carrito desde el contexto
    const [carritoVisible, setCarritoVisible] = useState(false); // Estado para controlar la visibilidad del carrito

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
            {/* ... Tu barra de navegación superior o inferior ... */}
            <ModalCarrito visible={totalItems > 0} cantidad={totalItems} onPress={() => setCarritoVisible(!carritoVisible)} />
            {carritoVisible && 
            (<VistaCarrito onClose={() => setCarritoVisible(false)}></VistaCarrito>)
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
        </div>
    );
}
