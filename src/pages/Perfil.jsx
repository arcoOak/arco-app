// Perfil.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate aquí

import LoadingModal from "../components/modals/LoadingModal"; // Asegúrate de tener un componente de carga

import './Perfil.css'; // Asegúrate de tener un archivo CSS para estilos

export default function Perfil({ onLogout }) {
    const [activeDiv, setActiveDiv] = useState(0);
    const [socio, setSocio] = useState(null); // Estado para almacenar los datos del socio
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const navigate = useNavigate(); // Hook useNavigate

    useEffect(() => {
        // Cambia el ID por el que corresponda según tu lógica de autenticación
        fetch('http://localhost:3000/api/socios/1')
            .then(res => res.json())
            .then(data => {
                setSocio(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDivClick = (index) => {
        if (activeDiv === index) {
            setActiveDiv(0); // Collapse the div if it's already active
            return;
        }
        setActiveDiv(index);
    };

    const handleUserLogout = () => {
        navigate('/login'); // Redirige a la página de login
    }

    if (loading) return <LoadingModal visible='true'>Cargando...</LoadingModal>;

    return (
        <div className="container-fluid">
            <div className="row mb-4 mt-4" >
                <div className="col-md-12">
                    <div className="profile-photo-container">
                        <img src="./src/img/perfil.jpg" alt="" className="profile-photo" />
                    </div>
                    <h2 className="mb-2">{socio.nombre} {socio.apellido}</h2>
                    <span className="profile-mail">Acción: {socio.id_usuario}</span>
                </div>
            </div >

            <div className="row mb-p">
                <div className="col-md-12">
                    <div className="profile-info">

                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Nombre y Apellido</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-user-square'></i> {socio.nombre} {socio.apellido}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 2 ? 'active' : ''} faq`} onClick={() => handleDivClick(2)}>
                                    <div className="head">
                                        <span className="label-info">Cédula</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 2 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-user-id-card'></i> V{socio.documento_identidad}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 3 ? 'active' : ''} faq`} onClick={() => handleDivClick(3)}>
                                    <div className="head">
                                        <span className="label-info">Teléfono</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 3 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-phone'></i>{socio.telefono}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 4 ? 'active' : ''} faq`} onClick={() => handleDivClick(4)}>
                                    <div className="head">
                                        <span className="label-info">Dirección</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 4 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-location'></i> {socio.direccion} </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 5 ? 'active' : ''} faq`} onClick={() => handleDivClick(5)}>
                                    <div className="head">
                                        <span className="label-info">Fecha de Nacimiento</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 5 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-calendar-alt'></i> {socio.fecha_nacimiento} </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 6 ? 'active' : ''} faq`} onClick={() => handleDivClick(6)}>
                                    <div className="head">
                                        <span className="label-info">Grupo Familiar</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 6 ? 'auto' : '0' }}
                                    >
                                        <label><i className='bx bx-parent-child'></i> 4 Hijos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item b-0 mt-2 py-3">
                            <span className="label-info pass">Cambiar Clave</span>
                            <span className="value"><i className='bx bx-lock-keyhole pass'></i></span>
                        </div>
                        <div className="info-item b-0 py-3">
                            {/* <span className="label-info exit">Cerrar Sesión</span> */}
                            <button onClick={handleUserLogout} className="exit-button">
                                <i className='bx bx-arrow-in-right-square-half exit'></i> Cerrar Sesión
                            </button>
                            {/* <span className="value"><i className='bx bx-arrow-in-right-square-half exit'></i></span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
