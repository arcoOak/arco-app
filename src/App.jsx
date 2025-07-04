import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import MonthlyOverview from "./components/MonthlyOverview";
import PaymentDetail from './components/PaymentDetail';
import Perfil from "./pages/Perfil/Perfil";
import EditarPerfil from "./pages/Perfil/EditarPerfil"; // Asegúrate de que la ruta sea correcta
import BeneficiariosLista from './pages/Perfil/BeneficiariosLista'; // Importa el nuevo componente
import Reservas from "./pages/Reserva";
import ReservaUnidad from "./pages/ReservaUnidad";
import Comercios from "./pages/Comercio/Comercio"; // Asumo que este es tu componente principal de lista de comercios
import ComercioDetalle from './pages/Comercio/ComercioDetalle';
import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute

import Login from "./Login"; // Importa el componente de Login

import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación

import { CartProvider } from './context/CartContext'


function App() {

    const { user, login, logout, isAuthenticated } = useAuth(); // Usa el contexto de autenticación

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
                        <Route path="/monthly-overview" element={<MonthlyOverview />} />
                        <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                        {/*Ruta de Perfiles*/}
                        <Route path="/perfil" element={<Perfil user={user} />} />
                        <Route path="/perfil/editar-perfil" element={<EditarPerfil user={user} />} />
                        <Route path="/perfil/beneficiarios" element={<BeneficiariosLista />} />

                        <Route path="/reservas" element={<Reservas />} />
                        <Route path="/reservas/:id" element={<ReservaUnidad />} />
                        <Route path="/comercios" element={<Comercios  />} />
                        <Route path="/comercio/:id" element={<ComercioDetalle  />} />
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