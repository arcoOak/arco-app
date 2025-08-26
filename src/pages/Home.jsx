import React, { useEffect } from "react";
import "../css/Home.css";
import Navbar from "./Navbar";
import NewsSection from '../components/NewsSection';
//import Points from '../components/Points'; // Importa tu componente Carousel
import ServicioSection from "../components/ServicioSection";
import MonthlyOverview from '../components/MonthlyOverview';

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../css/HomeCarousel.css';
import '../css/HomeComponents.css';
import Card from '../components/Card';
import Carousel from '../components/Carousel';

import TarjetaPendientes from '../components/home/TarjetaPendientes';
import TarjetaSaldo from '../components/home/TarjetaSaldo';
import TarjetaRecargar from '../components/home/TarjetaRecargar';
import TarjetaProgress from '../components/home/TarjetaProgress';

import TransacctionSection from '../components/TransacctionSection';
import PromotionCard from '../components/PromotionCard';

import ClimaHome from '../components/ClimaHome';
import RedesSocialesHome from "../components/RedesSocialesHome";
import HorarioHome from "../components/HorarioHome";

import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación


export default function App() {

    const navigate = useNavigate(); // Hook para navegar programáticamente

    const { user, login, logout, isAuthenticated, clubInfo, isDarkTheme } = useAuth();

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
            <div className="addCard">

                <div className={"home-bienvenida"}>
                    <p className={"home-bienvenida-text"}>Bienvenido,</p>
                    <h2>{user.nombre + ' ' + user.apellido}</h2>
                </div>
            </div>
            <TarjetaPendientes />
            <TarjetaSaldo />
            <TarjetaRecargar />
            <TarjetaProgress
                percentage={43}
            />
            <TransacctionSection />
            <div className="app">
                {/* Estado de Cuotas */}
                <section className="dues-section">

                    {/* <Points /> */}
                    <NewsSection />
                    <ServicioSection />
                    <PromotionCard />
                    <ClimaHome />                    
                    <HorarioHome clubInfo={clubInfo} />
                    <RedesSocialesHome />
                </section>
                {/* Footer */}
                
            </div>
        </>
    );
}
