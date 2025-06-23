import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil/Perfil";
import EditProfileScreen from "./components/EditProfileScreen"; // Asegúrate de que la ruta sea correcta
import FamilyMembersListScreen from './pages/Perfil/BeneficiariosLista'; // Importa el nuevo componente
import Reservas from "./pages/Reserva";
import ReservaUnidad from "./pages/ReservaUnidad";
import Comercios from "./pages/Comercio"; // Asumo que este es tu componente principal de lista de comercios
import ComercioDetalle from './components/ComercioDetalle';
import Qr from "./pages/Lectura";
import PrivateRoute from "./components/PrivateRoute"; // Importa PrivateRoute
import Login from "./login"; // Importa tu componente de Login

function App() {

    // Estado de autenticación
    // Usamos localStorage para persistir el estado de login
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; // Convertir el string a boolean
    });

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

    const [currentUser, setCurrentUser] = useState({
        id: 'user123',
        name: 'Johny Roria',
        action: 574,
        avatar: '/src/img/perfil.jpg', // Asegúrate de que esta ruta sea correcta desde la raíz pública
        cedula: 'V-25.632.154',
        phone: '+51 987654321', // Corregido según tu código
        mail: 'johnryan@gmail.com', // Corregido según tu código
        address: 'Venezuela, Caracas', // Corregido según tu código
        dob: '2000-01-01', // Formato YYYY-MM-DD para input type="date"
        email: 'johny.roria@example.com',
    });

    const handleUpdateUser = (updatedData) => {
        setCurrentUser(updatedData);
        console.log('Usuario actualizado en App.js:', updatedData);
        // Aquí es donde harías la llamada a tu API para actualizar el backend
    };

    // Nuevo estado para almacenar los familiares registrados
    const [familyMembers, setFamilyMembers] = useState([]);

    const handleRegisterFamilyMember = (newMemberData) => {
        // Genera un ID simple para el nuevo familiar (en una app real, el backend lo haría)
        const newMemberWithId = { ...newMemberData, id: Date.now().toString() };
        setFamilyMembers((prevMembers) => [...prevMembers, newMemberWithId]);
        console.log('Nuevo familiar registrado:', newMemberWithId);
        console.log('Familiares actuales:', [...familyMembers, newMemberWithId]);
        // Llama a tu API aquí para guardar el nuevo familiar
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública de Login */}
                <Route path="/Login" element={<Login onLogin={handleLogin} />} />

                {/* Rutas protegidas */}
                {/* Envuelve las rutas que requieren autenticación con PrivateRoute */}
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    {/* El Layout ahora se aplicará solo a las rutas autenticadas */}
                    <Route element={<Layout onLogout={handleLogout} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/perfil/editar-perfil" element={<EditProfileScreen user={currentUser} onUpdateUser={handleUpdateUser} />} />
                        <Route path="/perfil/beneficiarios" element={<FamilyMembersListScreen userId={currentUser.id} />} />
                        <Route path="/reservas" element={<Reservas />} />
                        <Route path="/reservas/:id" element={<ReservaUnidad />} />

                        {/* Pasar allBusinessesData a tu componente de lista de comercios */}
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