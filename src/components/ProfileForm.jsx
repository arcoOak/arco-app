// src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';

import Button from './buttons/Button'; // Importa el botón personalizado


const ProfileForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
        //console.log('Datos iniciales del formulario:', initialData);
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
                <label htmlFor="telefono">Teléfono</label>
                <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono || ''}
                    onChange={handleChange}
                    placeholder="Ej: +58 412 1234567"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion || ''}
                    onChange={handleChange}
                    placeholder="Ej: Av. Principal, Urb. El Sol"
                    required
                />
            </div>

            <div className="form-buttons">
                <Button type="submit" className="primary">Guardar</Button>
                <Button type="button" className="neutral" onClick={onCancel}>Cancelar</Button>
                
            </div>
        </form>
    );
};

export default ProfileForm;