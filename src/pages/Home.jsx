import React from "react";
import "../css/Home.css";
import Navbar from "./Navbar";
import NewsSection from '../components/NewsSection';
//import Points from '../components/Points'; // Importa tu componente Carousel
import TrainerSection from "../components/TrainerSection";
import MonthlyOverview from '../components/MonthlyOverview';
import ImageSlider from '../components/ImageSlider';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../css/HomeCarousel.css';
import '../css/HomeComponents.css';
import Card from '../components/Card';
import Carousel from '../components/Carousel';
import Balance from '../components/Balance';
import BalanceSection from '../components/BalanceSection';
import TransacctionSection from '../components/TransacctionSection';
import Slider from '../components/Slider';
import Progress from '../components/Progress';

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
            <Navbar />
            <div className="addCard">

                <div style={{ textAlign: 'left' }}>
                    <p>Bienvenido,</p>
                    <h3>Pedro Aguilar</h3>
                </div>
            </div>
            <Balance />
            <ImageSlider />
            <BalanceSection />
            <Progress
                percentage={43}
            />
            <TransacctionSection />
            <div className="app">
                {/* Estado de Cuotas */}
                <section className="dues-section">

                    {/* <Points /> */}
                    <NewsSection />
                    <TrainerSection />
                    <Slider />
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
                    <p><a href="#" onClick={() => navigate('/PrivacyPolicy')}>Política de Privacidad</a> | <a href="#" onClick={() => navigate('/TermsOfUse')}>Términos de Uso</a> | <a href="#" onClick={() => navigate('/FAQPage')} >FAQs</a></p>
                </footer>
            </div>
        </>
    );
}
