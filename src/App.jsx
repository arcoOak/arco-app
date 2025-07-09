import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import Notifications from "./components/Notifications";
import PaymentDetail from './components/PaymentDetail';
import Perfil from "./pages/Perfil/Perfil";
import EditarPerfil from "./pages/Perfil/EditarPerfil"; // Asegúrate de que la ruta sea correcta
import BeneficiariosLista from './pages/Perfil/BeneficiariosLista'; // Importa el nuevo componente
import Reservas from "./pages/Reserva";

/////
//import ReservaUnidad from "./pages/ReservaUnidad";
import Comercios from "./pages/Comercio/Comercio"; // Asumo que este es tu componente principal de lista de comercios
import ComercioDetalle from './pages/Comercio/ComercioDetalle';
import LecturaQr from "./pages/LecturaQr";
//import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute

//import Login from "./Login"; // Importa el componente de Login


////
import ReservaDetalle from "./components/ReservaDetalle"; // Asegúrate de que la ruta sea correcta
//import ReservaUnidad from "./pages/ReservaUnidad";
//import Comercios from "./pages/Comercio"; // Asumo que este es tu componente principal de lista de comercios
//import ComercioDetalle from './components/ComercioDetalle';
//import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute
import Login from "./login"; // Importa tu componente de Login
import Preloader from "./components/Preloader"; // Importa el componente Preloader
///////

import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación

import { CartProvider } from './context/CartContext'


function App() {

    const { user, login, logout, isAuthenticated } = useAuth(); // Usa el contexto de autenticación
    // Estado para controlar la visibilidad del preloader inicial
    const [showInitialPreloader, setShowInitialPreloader] = useState(true);

    // Estado de autenticación
    // Usamos localStorage para persistir el estado de login
    // const [isAuthenticated, setIsAuthenticated] = useState(() => {
    //     const storedAuth = localStorage.getItem('isAuthenticated');
    //     return storedAuth === 'true'; // Convertir el string a boolean
    // });

    // Efecto para ocultar el preloader inicial después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInitialPreloader(false);
        }, 2000); // Muestra el preloader por 2 segundos (ajusta el tiempo según necesites)
        return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }, []);

    // Efecto para guardar el estado de autenticación en localStorage
    // useEffect(() => {
    //     localStorage.setItem('isAuthenticated', isAuthenticated);
    // }, [isAuthenticated]);

    // Función para manejar el login
    // const handleLogin = () => {
    //     setIsAuthenticated(true);
    // };

    // Función para manejar el logout (opcional, podrías tener un botón de logout en Layout o Perfil)
    // const handleLogout = () => {
    //     setIsAuthenticated(false);
    //     // Opcional: redirigir a la página de login después de cerrar sesión
    //     // navigate('/login'); // No se puede usar useNavigate directamente aquí
    //     // Se usaría en un componente hijo que llame a handleLogout
    // };

    // ESTA es la ÚNICA declaración de allBusinesses
    const concesionarios = [
        { id: 1, category: 'Deportes', name: 'Tenis', description: 'Cancha de Tenis', img: './src/img/reservas/tenis.jpg' },
        { id: 2, category: 'Deportes', name: 'Padel', description: 'Cancha de Padel', img: './src/img/reservas/padel.jpg' },
        { id: 3, category: 'Deportes', name: 'Fútbol Sala', description: 'Cancha de Fútbol Sala', img: './src/img/reservas/futbol-sala.jpg' },
        { id: 4, category: 'Deportes', name: 'Fútbol Campo', description: 'Cancha de Fútbol Campo', img: './src/img/reservas/futbol-campo.jpg' },
        { id: 5, category: 'Espacios', name: 'Salón de Fiestas', description: 'Salón de Eventos', img: './src/img/reservas/kfc.png' },
        { id: 6, category: 'Parilleras', name: 'Parrillera', description: 'Parrillera de Carbón', img: 'src/img/reservas/parrillera.jpg' },
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
                    <Route element={
                        <CartProvider>
                            <Layout />
                        </CartProvider>
                        }>
                        <Route path="/" element={<Home />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                        {/*Ruta de Perfiles*/}
                        <Route path="/perfil" element={<Perfil user={user} />} />
                        <Route path="/perfil/editar-perfil" element={<EditarPerfil user={user} />} />
                        <Route path="/perfil/beneficiarios" element={<BeneficiariosLista />} />

                        <Route path="/reservas" element={<Reservas />} />
                        <Route path="/reservas/:id" element={<ReservaDetalle />} />
                        <Route path="/comercios" element={<Comercios  />} />
                        <Route path="/comercio/:id" element={<ComercioDetalle  />} />
                        <Route path="/qr" element={<LecturaQr />} />
                    </Route>
                </Route>

                {/* Opcional: Ruta para cualquier cosa no encontrada (404) */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter >
    );
}

export default App;