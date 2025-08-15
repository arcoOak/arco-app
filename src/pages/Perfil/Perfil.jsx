// Perfil.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate aquí

import LoadingModal from "../../components/modals/LoadingModal"; // Asegúrate de tener un componente de carga

import { useAuth } from "../../context/AuthContext"; // Importa el contexto de autenticación

import FormatearFecha from "../../utils/FormatearFecha";

import userImagePlaceholder from '../../assets/user_placeholder.svg';

import './Perfil.css'; // Asegúrate de tener un archivo CSS para estilos

export default function Perfil() {
    const [activeDiv, setActiveDiv] = useState(0);
    //const [socio, setSocio] = useState(null); // Estado para almacenar los datos del socio
    //const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const navigate = useNavigate(); // Hook useNavigate

    const { user, login, logout, loading, setLoading , isAuthenticated } = useAuth();
    
    const API_HOST = import.meta.env.VITE_API_HOST;

    

    const handleDivClick = (index) => {
        if (index >= 1 && index <= 5) {
            setActiveDiv(activeDiv === index ? 0 : index);
        } else {
            if (index === 6) { // Editar Perfil
                navigate('/perfil/editar-perfil');
            } else if (index === 7) { // Cambiar Clave
                alert('Funcionalidad de cambiar clave en desarrollo.');
            } else if (index === 8) { // Cerrar Sesión
                handleUserLogout();
            } else if (index === 9) { // Ver Beneficiarios (Nueva acción)
                navigate('/perfil/beneficiarios'); // Navega a la ruta de la lista de beneficiarios
            }
            setActiveDiv(0);
        }
    };

    const handleUserLogout = () => {
        logout();
        navigate('/login');
    };

    // const displayUser = socio || {
    //     name: 'Johny Roria',
    //     action: '5665',
    //     avatar: './src/img/perfil.jpg',
    //     cedula: 'V-12345678',
    //     phone: '+58 4245632541',
    //     address: 'Venezuela, Caracas',
    //     dob: '04/12/1990'
    // };

    return (
        <React.Fragment>
        <LoadingModal visible={loading}></LoadingModal>
        <div className="container-fluid">
            {/* ... (Tu código actual de encabezado y perfil) ... */}
            <div className="perfil-header" > 
                
                    <div className="profile-photo-container">
                        <img src={user.avatar || userImagePlaceholder} alt="Profile" className="profile-photo" />
                    </div>
                    <h2 className="mb-2">{user.nombre} {user.apellido}</h2>
                    <span className="profile-mail">Acción: {user.id_usuario}</span>
                
            </div >

            <div className="profile-info-container">
                    <div className="profile-info">

                        {/* Nombre y Apellido */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Nombre y Apellido</span>
                                        <i className="fa-solid fa-circle-arrow-down"></i>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0', maxHeight: activeDiv === 1 ? '50px' : '0px' }}
                                    >
                                        <label><i className='bx bx-user-square'></i> {user.nombre} {user.apellido}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cédula */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 2 ? 'active' : ''} faq`} onClick={() => handleDivClick(2)}>
                                    <div className="head">
                                        <span className="label-info">Cédula</span>
                                        <i className="fa-solid fa-circle-arrow-down"></i>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 2 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-user-id-card'></i> V{user.documento_identidad}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 3 ? 'active' : ''} faq`} onClick={() => handleDivClick(3)}>
                                    <div className="head">
                                        <span className="label-info">Teléfono</span>
                                        <i className="fa-solid fa-circle-arrow-down"></i>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 3 ? 'auto' : '0', maxHeight: activeDiv === 3 ? '50px' : '0px'}}
                                    >
                                        <label><i className='bx bx-phone'></i>{user.telefono}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 4 ? 'active' : ''} faq`} onClick={() => handleDivClick(4)}>
                                    <div className="head">
                                        <span className="label-info">Dirección</span>
                                        <i className="fa-solid fa-circle-arrow-down"></i>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 4 ? 'auto' : '0' , maxHeight: activeDiv === 4 ? '50px' : '0px' }}
                                    >
                                        <label><i className='bx bx-location'></i> {user.direccion} </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 5 ? 'active' : ''} faq`} onClick={() => handleDivClick(5)}>
                                    <div className="head">
                                        <span className="label-info">Fecha de Nacimiento</span>
                                        <i className="fa-solid fa-circle-arrow-down"></i>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 5 ? 'auto' : '0' , maxHeight: activeDiv === 5 ? '50px' : '0px'  }}
                                    >
                                        <label><i className='bx bx-calendar-alt'></i> {FormatearFecha(user.fecha_nacimiento)} </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Beneficiarios (para ver la lista) */}
                        <div className="info-item b-0 mt-2 py-3" onClick={() => handleDivClick(9)}> {/* Nuevo índice 9 para ver familiares */}
                            <span className="label-info pass">Beneficiarios</span>
                            <span className="value"><i className='bx bx-group pass'></i></span> {/* Icono más adecuado para una lista */}
                        </div>

                        {/* Editar Perfil (no colapsable, navega) */}
                        <div className="info-item b-0 py-3" onClick={() => handleDivClick(6)}>
                            <span className="label-info pass">Editar Perfil</span>
                            <span className="value"><i className='bx bx-gear pass'></i></span>
                        </div>

                        {/* Cambiar Clave (no colapsable, navega/modal) */}
                        <div className="info-item b-0 py-3" onClick={() => handleDivClick(7)}>
                            <span className="label-info pass">Cambiar Clave</span>
                            <span className="value"><i className='bx bx-lock-keyhole pass'></i></span>
                        </div>

                        {/* Cerrar Sesión (no colapsable, logout) */}
                        <div className="info-item b-0 py-3" onClick={() => handleDivClick(8)}>
                            <span className="label-info exit">Cerrar Sesión</span>
                            <span className="value"><i className='bx bx-arrow-in-right-square-half exit'></i></span>
                        </div>
                    </div>
                
            </div>
            <Outlet />
        </div>
        </React.Fragment>
    );
}