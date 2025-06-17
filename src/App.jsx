import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./css/App.css"; // Ensure you have the CSS file for styles
import Layout from "./Layout";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Reservas from "./pages/Reserva";
import Comercios from "./pages/Comercio";
import Qr from "./pages/Lectura";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/reservas" element={<Reservas />} />
                    <Route path="/comercios" element={<Comercios />} />
                    <Route path="/qr" element={<Qr />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
