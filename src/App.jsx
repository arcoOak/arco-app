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
import Comercios from "./pages/Comercio"; // Asumo que este es tu componente principal de lista de comercios
import ComercioDetalle from './pages/ComercioDetalle';
import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute

import Login from "./Login"; // Importa el componente de Login

import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación


function App() {

    const { user, login, logout, isAuthenticated } = useAuth(); // Usa el contexto de autenticación

    // ESTA es la ÚNICA declaración de allBusinesses
    // const allBusinessesData = [
    //     { id: 1, category: 'Comida', name: 'Burger King', description: 'Las mejores hamburguesas a la parrilla.', img: './src/img/comercios/burguer-king.jpg', phone: '+58-212-1234567' },
    //     { id: 2, category: 'Comida', name: 'KFC', description: 'Pollo frito original y crujiente.', img: './src/img/comercios/kfc.png', phone: '+58-212-2345678' },
    //     { id: 3, category: 'Comida', name: 'Burger Shack', description: 'Hamburguesas artesanales de autor.', img: 'src/img/comercios/burguer-shack.jpg', phone: '+58-212-3456789' },
    //     { id: 4, category: 'Comida', name: 'McDonald\'s', description: 'Arcos dorados, siempre contigo.', img: 'src/img/comercios/mcdonald.png', phone: '+58-212-4567890' }, // ID 4
    //     { id: 5, category: 'Comida', name: 'Domino\'s', description: 'Pizzas frescas y entrega rápida.', img: 'src/img/comercios/dominos.png', phone: '+58-212-5678901' },
    //     { id: 6, category: 'Comida', name: 'Abruzzo\'s', description: 'Auténtica cocina italiana.', img: 'src/img/comercios/abruzzo.jpg', phone: '+58-212-6789012' },
    //     { id: 7, category: 'Comida', name: 'Arturos', description: 'El sabor casero del pollo asado.', img: 'src/img/comercios/arturos.png', phone: '+58-212-7890123' },
    //     { id: 8, category: 'Comida', name: 'Bonsai Sushi', description: 'Fusión japonesa con sabor único.', img: 'src/img/comercios/bonsai.png', phone: '+58-212-8901234' },
    //     { id: 9, category: 'Cafetería', name: 'Starbucks', description: 'Tu café favorito, siempre contigo.', img: 'https://via.placeholder.com/100/A0522D/FFFFFF?text=SB', phone: '+58-212-9012345' },
    //     { id: 10, category: 'Heladería', name: 'Helados Tito', description: 'Variedad de sabores artesanales.', img: 'https://via.placeholder.com/100/ADD8E6/000000?text=HT', phone: '+58-212-0123456' },
    // ];


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
                        <Route path="/monthly-overview" element={<MonthlyOverview />} />
                        <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                        {/*Ruta de Perfiles*/}
                        <Route path="/perfil" element={<Perfil user={user} />} />
                        <Route path="/perfil/editar-perfil" element={<EditarPerfil user={user} />} />
                        <Route path="/perfil/beneficiarios" element={<BeneficiariosLista />} />

                        <Route path="/reservas" element={<Reservas />} />
                        <Route path="/reservas/:id" element={<ReservaUnidad />} />
                        <Route path="/comercios" element={<Comercios  />} />
                        {/* CORRECCIÓN: Añadir '/' antes de :id */}
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