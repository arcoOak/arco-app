import React from "react";
import "../css/Home.css";
import NewsSection from '../components/NewsSection'; // Importa tu componente Carousel
import MonthlyOverview from '../components/MonthlyOverview';
import ImageSlider from '../components/ImageSlider'; // Importa tu componente ImageSlider
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import '../css/HomeCarousel.css'; // Importa tu CSS para el carrusel

export default function App() {

    const navigate = useNavigate(); // Hook para navegar programáticamente

    // Función para manejar el clic en "Ver más"

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
            <div className="titleHome">
                <div className="titleHomeSide">
                    <img src="../src/img/perfil.jpg" alt="Logo" className="logo" />
                    <div className="text-left">
                        <p>Bienvenido, John!</p>
                        <h3>JUNIO 23, 2025</h3>
                    </div>
                </div>
                <div>
                    < i class='bx  bx-bell'  ></i>
                </div>
            </div>
            <div className="app-container">
                <div className="header">
                    <div className="header-left">
                        <span className="header-account-text">Deuda Actual</span>
                        <h1 className="header-balance">$ 55,00</h1>
                    </div>
                    <div className="header-right">
                        <button className="header-icon" aria-label="View Balance" onClick={() => navigate('/monthly-overview')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#213547" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.5 17 7.5 15 7.5 12C7.5 9.5 9.5 7.5 12 7.5C14.5 7.5 16.5 9.5 16.5 12C16.5 14.5 14.5 17 12 17ZM12 9.5C10.62 9.5 9.5 10.62 9.5 12C9.5 13.38 10.62 14.5 12 14.5C13.38 14.5 14.5 13.38 14.5 12C14.5 10.62 13.38 9.5 12 9.5Z" fill="#213547" />
                            </svg>
                        </button>
                        <button className="header-icon" aria-label="Add">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#213547" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4.5V19.5M4.5 12H19.5" stroke="#213547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <h3 className="section-title">Mis Cuentas</h3>
                <div
                    className={`balance-cards ${isDragging ? 'active' : ''}`}
                    ref={carouselRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="balance-card blue">
                        <span className="balance-card-icon"><i class='bx bx-dollar-circle'></i></span> {/* Placeholder for icon */}
                        <span className="balance-card-type">Tarjeta Débito/Crédito</span>
                        <span className="balance-card-value">$ 350,00</span>
                    </div>
                    <div className="balance-card dark-blue">
                        <span className="balance-card-icon"><i class='bx bx-dollar-circle'></i></span> {/* Placeholder for icon */}
                        <span className="balance-card-type">Binance</span>
                        <span className="balance-card-value">$ 350,00</span>
                    </div>
                    <div className="balance-card blue">
                        <span className="balance-card-icon"><i class='bx bx-dollar-circle'></i></span> {/* Placeholder for icon */}
                        <span className="balance-card-type">Paypal</span>
                        <span className="balance-card-value">$ 350,00</span>
                    </div>
                    <div className="balance-card dark-blue">
                        <span className="balance-card-icon"><i class='bx bx-dollar-circle'></i></span> {/* Placeholder for icon */}
                        <span className="balance-card-type">Zelle</span>
                        <span className="balance-card-value">$ 350,00</span>
                    </div>
                </div>

                <div className="antecipay-section">
                    <div className="antecipay-card">
                        <div className="antecipay-left">
                            <div className="antecipay-icon-wrapper">
                                <span className="antecipay-icon">S</span> {/* Placeholder for icon */}
                            </div>
                            <div className="antecipay-text">
                                <span className="antecipay-title">Saldo Disponible</span>
                                <span className="antecipay-value">$ 1.400</span>
                            </div>
                        </div>
                        <span className="antecipay-arrow">&gt;</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill"></div>
                    </div>
                </div>

                <div className="actions-grid">
                    <div className="action-item">
                        <div className="action-icon-wrapper">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 15H9V9H11V15ZM15 15H13V9H15V15Z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="action-text">Recargar</span>
                        <span className="action-arrow">&gt;</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon-wrapper">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 6H2V18H22V6ZM20 8V16H4V8H20ZM16 10H8V12H16V10Z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="action-text">Pagar</span>
                        <span className="action-arrow">&gt;</span>
                    </div>
                </div>
            </div>

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

                    <NewsSection /> {/* Aquí añades la sección de noticias */}
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
