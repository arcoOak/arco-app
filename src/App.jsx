import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import Notifications_user from "./pages/Notificaciones/Notifications_user";
import PagarPendientes from "./pages/BilleteraHome/PagarPendientes";
import PaymentDetail from './pages/BilleteraHome/PaymentDetail';
import TransaccionIndividual from "./pages/BilleteraHome/TransaccionIndividual"; 

import Noticias from "./pages/Noticias/Noticias"; // Importa el componente Noticias
import NoticiasDetalle from "./pages/Noticias/NoticiasDetalle"; // Importa el componente NoticiasDetalle

import Perfil from "./pages/Perfil/Perfil";
import EditarPerfil from "./pages/Perfil/EditarPerfil"; 
import BeneficiariosLista from './pages/Perfil/BeneficiariosLista'; 
import Espacios from "./pages/Espacios/Espacios";

import Comercios from "./pages/Comercio/Comercio"; 
import ComercioDetalle from './pages/Comercio/ComercioDetalle';

import Servicios from "./pages/Servicios/Servicios"; 
import ServiciosDetalle from './pages/Servicios/ServiciosDetalle';

import MisServicios from "./pages/MisServicios/MisServicios";
import MisServiciosDetalle from "./pages/MisServicios/MisServiciosDetalle";

import Compras from "./pages/MisCompras/MisCompras";
import ComprasDetalle from "./pages/MisCompras/MisComprasDetalle";

import LecturaQr from "./pages/LecturaQR/LecturaQr";



////
import EspaciosDetalle from "./pages/Espacios/EspaciosDetalle"; // Asegúrate de que la ruta sea correcta
//import ReservaUnidad from "./pages/ReservaUnidad";
//import Comercios from "./pages/Comercio"; // Asumo que este es tu componente principal de lista de comercios
//import ComercioDetalle from './components/ComercioDetalle';
//import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute
import Login from "./Login"; // Importa tu componente de Login
import Preloader from "./components/Preloader"; // Importa el componente Preloader
import FAQPage from "./pages/Faqs"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfUse from "./pages/TermsOfUse"

import Reservas from "./pages/Reservas/Reservas"; // Importa el componente de Reservas
import ReservasDetalle from "./pages/Reservas/ReservasDetalle"; // Importa el componente de detalle de reservas

import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación
import { CartProvider } from './context/CartContext'

import {NotificacionesProvider} from './context/NotificacionesContext' // Importa el proveedor de notificaciones

function App() {
    const { user, login, logout, isAuthenticated} = useAuth(); // Usa el contexto de autenticación
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
                            <NotificacionesProvider>
                                <Layout />
                            </NotificacionesProvider>
                        </CartProvider>
                        }>
                        <Route path="/" element={<Home />} />
                        <Route path="/FAQPage" element={<FAQPage />} />
                        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                        <Route path="/TermsOfUse" element={<TermsOfUse />} />
                        <Route path="/notifications_user" element={<Notifications_user />} />
                        <Route path="/pagar-pendientes" element={<PagarPendientes />} />
                        <Route path="/transaccion/" element={<PaymentDetail />} />
                        <Route path="/transaccion/:id" element={ <TransaccionIndividual /> } />

                        {/* Rutas de Noticias */}
                        <Route path="/noticias" element={<Noticias />} />
                        <Route path="/noticias/:id" element={<NoticiasDetalle />} />

                        {/*Ruta de Perfiles*/}
                        <Route path="/perfil" element={<Perfil user={user} />} />
                        <Route path="/perfil/editar-perfil" element={<EditarPerfil user={user} />} />
                        <Route path="/perfil/beneficiarios" element={<BeneficiariosLista />} />

                        {/* Rutas de Espacios */}
                        <Route path="/espacios" element={<Espacios />} />
                        <Route path="/espacios/:id" element={<EspaciosDetalle />} />

                        {/* Rutas de Comercios */}
                        <Route path="/comercios" element={<Comercios  />} />
                        <Route path="/comercios/:id" element={<ComercioDetalle   />} />

                        {/* Rutas de Servicios */}
                        <Route path="/servicios" element={<Servicios  />} />
                        <Route path="/servicios/:id" element={<ServiciosDetalle   />} />

                        {/* Rutas de Lectura de QR */}
                        <Route path="/qr" element={<LecturaQr />} />

                        {/* Rutas de Reservas */}
                        <Route path="/reservas" element={<Reservas />} />
                        <Route path="/reservas/:id" element={<ReservasDetalle />} />

                        {/* Rutas de Mis Servicios */}
                        <Route path="/mis-servicios" element={<MisServicios />} />
                        <Route path="/mis-servicios/:id" element={<MisServiciosDetalle />} />

                        {/* Rutas de Compras */}
                        <Route path="/compras" element={<Compras />} />
                        <Route path="/compras/:id" element={<ComprasDetalle />} />
                    </Route>
                </Route>

                {/* Opcional: Ruta para cualquier cosa no encontrada (404) */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter >
    );
}

export default App;