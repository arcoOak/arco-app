import React from 'react';
import '../css/Preloader.css'; // Importa el CSS del preloader

export default function Preloader() {
    return (
        <div className="preloader">
            <img src="../src/img/logo.png" alt="Cargando..." />
            <div className="pswp__preloader__icn">
                <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                </div>
            </div>
        </div>
    );
}