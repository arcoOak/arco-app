// Perfil.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate aquí

import LoadingModal from "../components/modals/LoadingModal"; // Asegúrate de tener un componente de carga

import '../css/Perfil.css'; // Asegúrate de tener un archivo CSS para estilos

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
        if (index >= 1 && index <= 5) {
            setActiveDiv(activeDiv === index ? 0 : index);
        } else {
            if (index === 6) { // Editar Perfil
                navigate('/edit-profile');
            } else if (index === 7) { // Cambiar Clave
                alert('Funcionalidad de cambiar clave en desarrollo.');
            } else if (index === 8) { // Cerrar Sesión
                handleUserLogout();
            } else if (index === 9) { // Ver Beneficiarios (Nueva acción)
                navigate('/beneficiaries'); // Navega a la ruta de la lista de beneficiarios
            }
            setActiveDiv(0);
        }
    };

    const handleUserLogout = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    const displayUser = socio || {
        name: 'Johny Roria',
        action: '5665',
        avatar: './src/img/perfil.jpg',
        cedula: 'V-12345678',
        phone: '+58 4245632541',
        address: 'Venezuela, Caracas',
        dob: '04/12/1990'
    };

    if (loading) return <LoadingModal visible='true'>Cargando...</LoadingModal>;

    return (
        <div className="container-fluid">
            {/* ... (Tu código actual de encabezado y perfil) ... */}
            <div className="row mb-4 mt-4" >
                <div className="col-md-12">
                    <div className="profile-photo-container">
                        <img src={socio.avatar || './src/img/perfil.jpg'} alt="Profile" className="profile-photo" />
                    </div>
                    <h2 className="mb-2">{socio.nombre} {socio.apellido}</h2>
                    <span className="profile-mail">Acción: {socio.id_usuario}</span>
                </div>
            </div >

            <div className="row mb-2">
                <div className="col-md-12 p-p">
                    <div className="profile-info">

                        {/* Nombre y Apellido */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">< i class='bx  bx-user bx-lg'  ></i>  Nombre y Apellido</span>
                                        <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0', maxHeight: activeDiv === 1 ? '50px' : '0px' }}
                                    >
                                        <label>{socio.nombre} {socio.apellido}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cédula */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 2 ? 'active' : ''} faq`} onClick={() => handleDivClick(2)}>
                                    <div className="head">
                                        <span className="label-info">< i class='bx  bx-user-id-card bx-lg'  ></i>  Cédula</span>
                                        <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 2 ? 'auto' : '0' }}
                                    >
                                        <label>V{socio.documento_identidad}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 3 ? 'active' : ''} faq`} onClick={() => handleDivClick(3)}>
                                    <div className="head">
                                        <span className="label-info">< i class='bx  bx-phone bx-lg'  ></i> Teléfono</span>
                                        <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 3 ? 'auto' : '0', maxHeight: activeDiv === 3 ? '50px' : '0px' }}
                                    >
                                        <label>{socio.telefono}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 4 ? 'active' : ''} faq`} onClick={() => handleDivClick(4)}>
                                    <div className="head">
                                        <span className="label-info">< i class='bx  bx-location-alt-2 bx-lg'  ></i> Dirección</span>
                                        <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 4 ? 'auto' : '0', maxHeight: activeDiv === 4 ? '50px' : '0px' }}
                                    >
                                        <label>{socio.direccion} </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="info-item b-0">
                            <div className="faqs">
                                <div className={`${activeDiv === 5 ? 'active' : ''} faq`} onClick={() => handleDivClick(5)}>
                                    <div className="head">
                                        <span className="label-info">< i class='bx  bx-calendar-alt bx-lg'  ></i>  Fecha de Nacimiento</span>
                                        <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 5 ? 'auto' : '0', maxHeight: activeDiv === 5 ? '50px' : '0px' }}
                                    >
                                        <label>{socio.fecha_nacimiento} </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="profile-info">

                        {/* Beneficiarios (para ver la lista) */}
                        <div className="info-item" onClick={() => handleDivClick(9)}>
                            <div className="faqs">
                                <div className="faq">
                                    <div className="head">
                                        <span className="label-info"><i className='bx bx-group pass'></i> Beneficiarios</span>
                                        <svg width={18} height={19} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-item" onClick={() => handleDivClick(6)}>
                            <div className="faqs">
                                <div className="faq">
                                    <div className="head">
                                        <span className="label-info"><i className='bx bx-gear pass'></i> Editar Perfil</span>
                                        <svg width={18} height={19} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-item" onClick={() => handleDivClick(7)}>
                            <div className="faqs">
                                <div className="faq">
                                    <div className="head">
                                        <span className="label-info"><i className='bx bx-lock-keyhole pass'></i> Cambiar Clave</span>
                                        <svg width={18} height={19} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-item b-0" onClick={() => handleDivClick(8)}>
                            <div className="faqs">
                                <div className="faq">
                                    <div className="head">
                                        <span className="label-info"><i className='bx bx-arrow-in-right-square-half exit'></i> Cerrar Sesión</span>
                                        <svg width={18} height={19} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Oak Tree C.A.</p>
                <p>Todos los derechos reservados.</p>
                <p><a href="#">Política de Privacidad</a> | <a href="#">Términos de Uso</a></p>
            </footer>
        </div>
    );
}