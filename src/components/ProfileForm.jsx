// src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';


const ProfileForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="fullName">Nombre y Apellido</label>

                <input
                    type="text"
                    id="fullName"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Ej: Johny Roria"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cedula">Cédula</label>
                <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formData.cedula || ''}
                    onChange={handleChange}
                    placeholder="Ej: V-12345678"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Ej: +58 412 1234567"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Correo</label>
                <input
                    type="mail"
                    id="mail"
                    name="mail"
                    value={formData.mail || ''}
                    onChange={handleChange}
                    placeholder="correo@gmail.com"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Ej: Av. Principal, Urb. El Sol"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="dob">Fecha de Nacimiento</label>
                <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="save-button">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default ProfileForm;