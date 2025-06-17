import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout() {
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const menuItems = [
        { icon: "bx bxs-home-alt-2", label: "Inicio", path: "/" },
        { icon: "bx bxs-calendar-alt", label: "Reservas", path: "/reservas" },
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
