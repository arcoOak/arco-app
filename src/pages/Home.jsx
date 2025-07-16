import React from "react";
import "../css/Home.css";
<<<<<<< Updated upstream
import NewsSection from '../components/NewsSection'; // Importa tu componente Carousel
=======

import NewsSection from '../components/NewsSection';
//import Points from '../components/Points'; // Importa tu componente Carousel
>>>>>>> Stashed changes
import TrainerSection from "../components/TrainerSection";
import MonthlyOverview from '../components/MonthlyOverview';
import ImageSlider from '../components/ImageSlider'; // Importa tu componente ImageSlider
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import '../css/HomeCarousel.css'; // Importa tu CSS para el carrusel
import '../css/HomeComponents.css'; // Importa tu CSS para los componentes de la página
import Card from '../components/Card';
import Carousel from '../components/Carousel'; // Importa tu componente Carousel
import BalanceSection from '../components/BalanceSection';
import TransacctionSection from '../components/TransacctionSection';

import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación


export default function App() {

    const navigate = useNavigate(); // Hook para navegar programáticamente

    const { user, login, logout, isAuthenticated } = useAuth();

    // State for drag functionality
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);

    // Mouse events for dragging
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiplier for faster scrolling
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    // Touch events for dragging
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };


    return (
        <>
<<<<<<< Updated upstream
            <div className="titleHome">
                <div className="titleHomeSide">
                    <img src="../src/img/perfil.jpg" alt="Logo" className="logo" />
                    <div className="text-left">
                        <p>Bienvenido!</p>
                        <h3>{user.nombre + ' ' + user.apellido}</h3>
                    </div>
                </div>
                <div
                    className="titleNotification" 
                    onClick={() => navigate('notifications')}
                >
                    <div className="notification"></div>
                    <i className='bx bx-bell'></i>
=======
            <div className="addCard">

                <div style={{ textAlign: 'left' }}>
                    <p>Bienvenido,</p>
                    <h3>Pedro Aguilar</h3>
>>>>>>> Stashed changes
                </div>
            </div>

            <BalanceSection />

            <div className="addCard">
                <h3>Cuentas</h3>
                <div>
                    <i className="fa fa-plus"></i> <label>Agregar Cuenta</label>
                </div>
            </div>
            <ImageSlider />
            <TransacctionSection />

            <div className="app">
                {/* Estado de Cuotas */}
                <section className="dues-section">

                    {/* <ImageSlider />
                <div className="payment_action">
                    <button>
                        <i class='bx bxs-swap-horizontal'></i>
                        Tranferir
                    </button>
                    <button>
                        <i class='bx bxs-inbox'></i>
                        Recibir
                    </button>
                    <button>
                        <i class='bx bxs-wallet'></i>
                        Pagar
                    </button>
                </div> */}
                    {/* <h2>Estado de Cuota</h2>
                <p>Estado: <span className="status pending">Pendiente</span></p>
                <p>Monto Adeudado: $50.000</p>
                <button>Pagar Ahora</button>
                <div className="progress-bar">
                    <div className="filled" style={{ width: "30%" }}></div>
                </div> */}

                    <NewsSection />
                    <TrainerSection />

                    <br /><br />
                    <h2>Promociones Especiales</h2>
                    <p>🍹 2x1 en tragos en el Bar de Playa</p>
                    <p>🎾 20% en alquiler de cancha</p>
                    <br /><br />
                    <h2>Clima Actual</h2>
                    <p>🌤️ 27°C - Soleado</p>
                    <h3>Horarios</h3>
                    <p>Club abierto: 8:00 - 22:00</p>
                    <h3>Redes Sociales</h3>
                    <p>@clubplayero</p>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <p>© 2025 Oak Tree C.A.</p>
                    <p>Todos los derechos reservados.</p>
                    <p><a href="#">Política de Privacidad</a> | <a href="#">Términos de Uso</a></p>
                </footer>
            </div>
        </>
    );
}
