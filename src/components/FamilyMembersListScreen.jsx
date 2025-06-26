// src/components/FamilyMembersListScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Importa el componente QRCode
import '../css/FamilyMembersListScreen.css';

export default function FamilyMembersListScreen({ userId }) {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const fetchBeneficiaries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await new Promise(resolve => setTimeout(() => {
                const dummyData = [
                    {
                        id: 'fam1',
                        name: 'María',
                        lastName: 'Hernández',
                        cedula: 'V-00998877',
                        birthYear: 1988,
                        relationship: 'Esposa',
                        photo: '../src/img/beneficiarios/beneficiario2.jpg'
                    },
                    {
                        id: 'fam2',
                        name: 'Ana',
                        lastName: 'Roria',
                        cedula: 'V-11223344',
                        birthYear: 2010,
                        relationship: 'Hija',
                        photo: '../src/img/beneficiarios/beneficiario1.jpg'
                    },
                    {
                        id: 'fam3',
                        name: 'Carlos',
                        lastName: 'Roria',
                        cedula: 'V-00112233',
                        birthYear: 2015,
                        relationship: 'Hijo',
                        photo: '../src/img/beneficiarios/beneficiario3.jpg'
                    },
                ];
                resolve({
                    ok: true,
                    json: () => Promise.resolve(dummyData.map(member => ({
                        ...member,
                        qrCodeData: generateQrCodeData(member.cedula, member.id) // Agrega el QR data a cada miembro
                    })))
                });
            }, 1000));

            if (!response.ok) {
                throw new Error('Error al cargar los beneficiarios. Código: ' + response.status);
            }
            const data = await response.json();
            setBeneficiaries(data);
        } catch (err) {
            console.error("Error fetching beneficiaries:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]); // generateQrCodeData no es una dependencia porque sus dependencias son estáticas o ya están en userId

    useEffect(() => {
        if (userId) {
            fetchBeneficiaries();
        }
    }, [userId, fetchBeneficiaries]);

    const handleBackClick = () => {
        navigate('/perfil');
    };

    const handleAddMemberClick = () => {
        navigate('/add-beneficiary');
    };

    const handleEditMember = (memberId) => {
        alert(`Editar familiar con ID: ${memberId}`);
        navigate(`/edit-beneficiary/${memberId}`);
    };

    if (loading) {
        return (
            <div className="family-list-container">
                <div className="family-list-header">
                    <button className="back-button" onClick={handleBackClick}>←</button>
                    <h2>Cargando Beneficiarios...</h2>
                </div>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando datos, por favor espere.</p>
            </div>
        );
    }

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

            {beneficiaries.length === 0 ? (
                <p className="no-members-message">No tienes beneficiarios registrados aún.</p>
            ) : (
                <div className="family-members-grid">
                    {beneficiaries.map((member) => (
                        <div key={member.id} className="family-member-card">
                            <img src={member.photo || 'https://via.placeholder.com/80'} alt={`${member.name} ${member.lastName}`} className="member-photo" />
                            <div className="member-details">
                                <h3>{member.name} {member.lastName}</h3>
                                <p><i className='bx bx-id-card'></i> C.I.: {member.cedula}</p>
                                <p><i className='bx bx-calendar'></i> Año Nac.: {member.birthYear}</p>
                                <p><i className='bx bx-group'></i> Parentesco: {member.relationship}</p>
                            </div>
                            {/* Sección del QR */}
                            {member.qrCodeData && (
                                <div className="qr-code-container">
                                    <QRCode
                                        value={member.qrCodeData}
                                        size={100} // Tamaño del QR
                                        level="L" // Nivel de corrección de error (L, M, Q, H)
                                    />
                                    {/* <span className="qr-label">QR</span>  Opcional: etiqueta para el QR */}
                                </div>
                            )}
                            <i className='bx bx-edit edit-member-icon' onClick={() => handleEditMember(member.id)}></i>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}