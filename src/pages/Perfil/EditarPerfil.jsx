// src/components/EditProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../../components/ProfileForm';
import './EditarPerfil.css'; // Asegúrate de tener este CSS para los estilos
import { useAuth } from "../../context/AuthContext"; // Importa el contexto de autenticación

import LoadingModal from '../../components/modals/LoadingModal'; // Importa el modal de carga
import ExitosoModal from '../../components/modals/ExitosoModal';

import userImagePlaceholder from '../../assets/user_placeholder.svg';

const EditarPerfil = () => {

    const { user, login, logout, editarUsuario, isAuthenticated, loading } = useAuth();

    const [showExitosoModal, setShowExitosoModal] = useState(false);

    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(user);

    useEffect(() => {
        //console.log('Datos del usuario:', user);
    },[])

    const handleSaveProfile = async (updatedData) => {
        //console.log('Datos del perfil guardados:', updatedData);
        
        const success = await editarUsuario(updatedData)
        if(success){
            setShowExitosoModal(true);
            setTimeout(() => {
                setShowExitosoModal(false);
                navigate('/perfil');
            }, 2000); // Cierra el modal después de 2 segundos
        }
    };

    const handleCancel = () => {
        navigate('/perfil'); // Vuelve a la pantalla de perfil sin guardar
    };

    const handleChangePassword = () => {
        alert('Interfaz para cambiar clave en desarrollo.');
    };

    const handleChangePhoto = () => {
        // Lógica para cambiar la foto (abrir selector de archivos, subir imagen, etc.)
        alert('Funcionalidad para cambiar foto en desarrollo.');
    };

    return (
        <React.Fragment>
        <ExitosoModal visible={showExitosoModal} message="Perfil actualizado exitosamente" />
        <LoadingModal visible={loading} />
        <div className="edit-profile-container">
            <button className="back-button" onClick={handleCancel}><i className="bx bx-arrow-back"></i> Volver</button>
            <div className="edit-profile-header">
                <h2>Editar Perfil</h2>
            </div>

            <div className="profile-photo-section">
                <img
                    src={profileData.avatar || userImagePlaceholder} 
                    className="current-profile-photo"
                />
                <button className="change-photo-button" onClick={handleChangePhoto}>Cambiar Foto</button>
            </div>

            <ProfileForm initialData={profileData} onSave={handleSaveProfile} onCancel={handleCancel} />

        </div>
        </React.Fragment>
    );
};

export default EditarPerfil;