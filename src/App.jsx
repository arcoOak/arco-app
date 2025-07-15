import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import Notifications from "./components/Notifications";
import PaymentDetail from './components/PaymentDetail';
import Perfil from "./pages/Perfil/Perfil";
import EditProfileScreen from "./components/EditProfileScreen"; // Asegúrate de que la ruta sea correcta
import BeneficiariosLista from './pages/Perfil/BeneficiariosLista'; // Importa el nuevo componente
import Reservas from "./pages/Reserva";
import ReservaDetalle from "./components/ReservaDetalle"; // Asegúrate de que la ruta sea correcta
//import ReservaUnidad from "./pages/ReservaUnidad";
import Comercios from "./pages/Comercio"; // Asumo que este es tu componente principal de lista de comercios
import ComercioDetalle from './components/ComercioDetalle';
import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute
import Login from "./Login"; // Importa tu componente de Login
import Preloader from "./components/Preloader"; // Importa el componente Preloader
import FAQPage from "./pages/Faqs"
import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfUse from "./pages/TermsOfUse"

function App() {

    const { user, login, logout, isAuthenticated} = useAuth(); // Usa el contexto de autenticación
    // Estado para controlar la visibilidad del preloader inicial
    const [showInitialPreloader, setShowInitialPreloader] = useState(true);

    // Estado de autenticación
    // Usamos localStorage para persistir el estado de login
    /* const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; // Convertir el string a boolean
    }); */

    // Efecto para ocultar el preloader inicial después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInitialPreloader(false);
        }, 2000); // Muestra el preloader por 2 segundos (ajusta el tiempo según necesites)
        return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }, []);

    // Efecto para guardar el estado de autenticación en localStorage
    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    // Función para manejar el login
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Función para manejar el logout (opcional, podrías tener un botón de logout en Layout o Perfil)
    const handleLogout = () => {
        setIsAuthenticated(false);
        // Opcional: redirigir a la página de login después de cerrar sesión
        // navigate('/login'); // No se puede usar useNavigate directamente aquí
        // Se usaría en un componente hijo que llame a handleLogout
    };

    // ESTA es la ÚNICA declaración de allBusinesses
    const concesionarios = [
        { id: 1, category: 'Deportes', name: 'Tenis', description: 'Cancha de Tenis', img: './src/img/reservas/tenis.jpg' },
        { id: 2, category: 'Deportes', name: 'Padel', description: 'Cancha de Padel', img: './src/img/reservas/padel.jpg' },
        { id: 3, category: 'Deportes', name: 'Fútbol Sala', description: 'Cancha de Fútbol Sala', img: './src/img/reservas/futbol-sala.jpg' },
        { id: 4, category: 'Deportes', name: 'Fútbol Campo', description: 'Cancha de Fútbol Campo', img: './src/img/reservas/futbol-campo.jpg' },
        { id: 5, category: 'Espacios', name: 'Salón de Fiestas', description: 'Salón de Eventos', img: './src/img/reservas/kfc.png' },
        { id: 6, category: 'Parilleras', name: 'Parrillera', description: 'Parrillera de Carbón', img: 'src/img/reservas/parrillera.jpg' },
    ];

    // ESTA es la ÚNICA declaración de allBusinesses
    const allBusinessesData = [
        { id: 1, category: 'Comida', name: 'Burger King', description: 'Las mejores hamburguesas a la parrilla.', img: './src/img/comercios/burguer-king.jpg', phone: '+58-212-1234567' },
        { id: 2, category: 'Comida', name: 'KFC', description: 'Pollo frito original y crujiente.', img: './src/img/comercios/kfc.png', phone: '+58-212-2345678' },
        { id: 3, category: 'Comida', name: 'Burger Shack', description: 'Hamburguesas artesanales de autor.', img: 'src/img/comercios/burguer-shack.jpg', phone: '+58-212-3456789' },
        { id: 4, category: 'Comida', name: 'McDonald\'s', description: 'Arcos dorados, siempre contigo.', img: 'src/img/comercios/mcdonald.png', phone: '+58-212-4567890' }, // ID 4
        { id: 5, category: 'Comida', name: 'Domino\'s', description: 'Pizzas frescas y entrega rápida.', img: 'src/img/comercios/dominos.png', phone: '+58-212-5678901' },
        { id: 6, category: 'Comida', name: 'Abruzzo\'s', description: 'Auténtica cocina italiana.', img: 'src/img/comercios/abruzzo.jpg', phone: '+58-212-6789012' },
        { id: 7, category: 'Comida', name: 'Arturos', description: 'El sabor casero del pollo asado.', img: 'src/img/comercios/arturos.png', phone: '+58-212-7890123' },
        { id: 8, category: 'Comida', name: 'Bonsai Sushi', description: 'Fusión japonesa con sabor único.', img: 'src/img/comercios/bonsai.png', phone: '+58-212-8901234' },
        { id: 9, category: 'Cafetería', name: 'Starbucks', description: 'Tu café favorito, siempre contigo.', img: 'https://via.placeholder.com/100/A0522D/FFFFFF?text=SB', phone: '+58-212-9012345' },
        { id: 10, category: 'Heladería', name: 'Helados Tito', description: 'Variedad de sabores artesanales.', img: 'https://via.placeholder.com/100/ADD8E6/000000?text=HT', phone: '+58-212-0123456' },
    ];

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública de Login */}
                <Route path="/Login" element={<Login />} />

                {/* Rutas protegidas */}
                {/* Envuelve las rutas que requieren autenticación con PrivateRoute */}
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    {/* El Layout ahora se aplicará solo a las rutas autenticadas */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/FAQPage" element={<FAQPage />} />
                        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                        <Route path="/TermsOfUse" element={<TermsOfUse />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/perfil/editar-perfil" element={<EditProfileScreen />} />
                        <Route path="/perfil/beneficiarios" element={<BeneficiariosLista />} />
                        <Route path="/reservas" element={<Reservas concesionarios={concesionarios} />} />
                        <Route path="/reservas/:id" element={<ReservaDetalle concesionarios={concesionarios} />} />
                        <Route path="/comercios" element={<Comercios allBusinesses={allBusinessesData} />} />
                        {/* CORRECCIÓN: Añadir '/' antes de :id */}
                        <Route path="/comercio/:id" element={<ComercioDetalle allBusinesses={allBusinessesData} />} />
                        <Route path="/qr" element={<Qr />} />
                    </Route>
                </Route>

                {/* Opcional: Ruta para cualquier cosa no encontrada (404) */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter >
    );
}

export default App;