// src/components/FamilyMembersListScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Importa el componente QRCode
import './BeneficiariosLista.css';

import LoadingModal from '../../components/modals/LoadingModal'; 
import ModalFormulario from '../../components/modals/ModalFormulario'; 


export default function BeneficiariosLista({ userId }) {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showFormularioModal, setShowFormularioModal] = useState(false);

     const API_HOST = import.meta.env.VITE_API_HOST;

    useEffect(() => {
        // Cambia el ID por el que corresponda según tu lógica de autenticación
        fetch(`${API_HOST}/api/familiares/buscar/1`)
            .then(res => res.json())
            .then(data => {

                setBeneficiaries(data);

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleCloseModal = () => {
        setShowFormularioModal(false);
    }

    // Función para generar una URL de QR de demostración
    // En un caso real, esta URL provendría de tu backend
    const generateQrCodeData = (cedula, id) => {
        // Idealmente, aquí usarías una URL de tu aplicación que resuelva al perfil del beneficiario
        // Por ejemplo: `https://tudominio.com/beneficiario/${id}`
        // O simplemente un texto que identifique al beneficiario: `Beneficiario:${cedula}`
        // Para demostración, usaremos un servicio público de QR que codifica texto.
        // Asegúrate de que los datos codificados sean únicos para cada beneficiario.
        return `Socio:${userId}-Beneficiario:${id}-CI:${cedula}`;
    };

    // const fetchBeneficiaries = useCallback(async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await new Promise(resolve => setTimeout(() => {
    //             const dummyData = [
    //                 {
    //                     id: 'fam1',
    //                     name: 'María',
    //                     lastName: 'Hernández',
    //                     cedula: 'V-00998877',
    //                     birthYear: 1988,
    //                     relationship: 'Esposo',
    //                     photo: '../src/img/beneficiarios/beneficiario2.jpg'
    //                 },
    //                 {
    //                     id: 'fam2',
    //                     name: 'Ana',
    //                     lastName: 'Roria',
    //                     cedula: 'V-11223344',
    //                     birthYear: 2010,
    //                     relationship: 'Hija',
    //                     photo: '../src/img/beneficiarios/beneficiario1.jpg'
    //                 },
    //                 {
    //                     id: 'fam3',
    //                     name: 'Carlos',
    //                     lastName: 'Roria',
    //                     cedula: 'V-00112233',
    //                     birthYear: 2015,
    //                     relationship: 'Hija',
    //                     photo: '../src/img/beneficiarios/beneficiario3.jpg'
    //                 },
    //             ];
    //             resolve({
    //                 ok: true,
    //                 json: () => Promise.resolve(dummyData.map(member => ({
    //                     ...member,
    //                     qrCodeData: generateQrCodeData(member.cedula, member.id) // Agrega el QR data a cada miembro
    //                 })))
    //             });
    //         }, 1000));

    //         if (!response.ok) {
    //             throw new Error('Error al cargar los beneficiarios. Código: ' + response.status);
    //         }
    //         const data = await response.json();
    //         setBeneficiaries(data);
    //     } catch (err) {
    //         console.error("Error fetching beneficiaries:", err);
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [userId]); // generateQrCodeData no es una dependencia porque sus dependencias son estáticas o ya están en userId

    // useEffect(() => {
    //     if (userId) {
    //         fetchBeneficiaries();
    //     }
    // }, [userId, fetchBeneficiaries]);

    const handleBackClick = () => {
        navigate('/perfil');
    };

    const handleAddMemberClick = () => {
        setShowFormularioModal(true);
    };

    const handleEditMember = (memberId) => {
        alert(`Editar familiar con ID: ${memberId}`);
        navigate(`/edit-beneficiary/${memberId}`);
    };

    if (loading) return <LoadingModal visible='true'>Cargando...</LoadingModal>;

    if (error) {
        return (
            <div className="family-list-container">
                <div className="family-list-header">
                    <button className="back-button" onClick={handleBackClick}>←</button>
                    <h2>Error al Cargar Beneficiarios</h2>
                </div>
                <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>Ocurrió un error: {error}</p>
                <button className="add-member-button" onClick={fetchBeneficiaries} style={{ marginTop: '20px', backgroundColor: '#dc3545' }}>Reintentar</button>
            </div>
        );
    }

    return (
        <React.Fragment>
        <div className="family-list-container">
            <div className="family-list-header">
                <button className="back-button" onClick={handleBackClick}>←</button>
                <h2>Mis Beneficiarios</h2>
            </div>

            <div className="add-member-button-container">
                <button className="add-member-button" onClick={handleAddMemberClick}>
                    <i className='bx bx-user-plus'></i> Agregar Nuevo
                </button>
            </div>

            
                <div className="family-members-grid">
                    {beneficiaries.map((member) => (
                        <div key={member.id_familiar} className="family-member-card">
                            <img src={member.photo || '../../src/assets/user_placeholder.svg'} alt={`${member.nombre} ${member.apellido}`} className="member-photo" />
                            <div className="member-details">
                                <h3>{member.nombre} {member.apellido}</h3>
                                <p><i className='bx bx-id-card'></i> C.I.: {member.documento_identidad}</p>
                                <p><i className='bx bx-calendar'></i> Año Nac.: {member.fecha_nacimiento}</p>
                                <p><i className='bx bx-group'></i> Parentesco: {member.nombre_parentesco}</p>
                            </div>
                            {member.qrCodeData && ( //Sección del QR
                                <div className="qr-code-container">
                                    <QRCode
                                        value={member.qrCodeData}
                                        size={70} // Tamaño del QR
                                        level="L" // Nivel de corrección de error (L, M, Q, H)
                                    />
                                    
                                </div>
                            )}
                            <i className='bx bx-edit edit-member-icon' onClick={() => handleEditMember(member.id)}></i>
                        </div>
                    ))}
                </div>
            
        </div>

            <ModalFormulario
                onClose={() => handleCloseModal(false)}   
                onSubmit={() => handleCloseModal(false)}
                visible={showFormularioModal}
                titulo="Agregar Beneficiario"
            >
                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="nombre">Nombre</label>
                        <input className='box-form-container-input' type="text" name="nombre" placeholder="Nombre" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="apellido">Apellido</label>
                        <input className='box-form-container-input' type="text" name="apellido" placeholder="Apellido" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="documento_identidad">Cédula de Identidad</label>
                        <input className='box-form-container-input' type="number" name="documento_identidad" placeholder="Cédula de Identidad" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input className='box-form-container-input' type="date" name="fecha_nacimiento" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="telefono">Teléfono</label>
                        <input className='box-form-container-input' type="text" name="telefono" placeholder="Teléfono" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="direccion">Dirección</label>
                        <input className='box-form-container-input' type="text" name="direccion" placeholder="Dirección" required />
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="id_genero">Género</label>
                        <select className='box-form-container-input' name="id_genero" required>
                            <option value="">Selecciona un género</option>
                            <option value="1">Masculino</option>
                            <option value="2">Femenino</option>
                        </select>
                    </div>

                    <div className='box-form-container'>
                        <label className='box-form-container-label' htmlFor="id_parentesco">Parentesco</label>
                        <select className='box-form-container-input' name="id_parentesco" required>
                            <option value="">Selecciona un parentesco</option>
                            <option value="1">Esposo(a)</option>
                            <option value="2">Hijo(a)</option>
                            <option value="3">Padre/Madre</option>
                            <option value="4">Hermano(a)</option>
                            <option value="5">Otro</option>
                        </select>
                    </div>


                </ModalFormulario>      

        </React.Fragment>
    );
}