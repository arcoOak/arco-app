import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; // Crea este archivo CSS

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        // Lógica de autenticación simple (sustituir con una API real)
        if (username === 'usuario' && password === 'contrasena') {
            onLogin(); // Llama a la función de login pasada desde App.jsx
            navigate('/'); // Redirige a la página de comercios después del login
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };
    return (
        <div className="login-container">
            <div className="form-wrapper">
                <div className="wave-container">
                    <svg viewBox="0 0 1440 320" className="wave">
                        <path fill="#ffffff" fillOpacity="1"
                            d="M0,250 C360,100 1080,300 1440,130 L1440,320 L0,320 Z"></path>
                    </svg>
                </div>
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <img src="./src/img/flotador.png" alt="flotador" />
                            <h2 className="welcome-title">Bienvenido de vuelta</h2>
                            <p className="subtitle">Conéctese a su cuenta</p>
                            <div className="formControl">
                                <button>
                                    <i className='bx bx-user'></i>
                                </button>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    placeholder='Usuario'
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="formControl">
                                <button>
                                    <i className='bx bx-lock-keyhole'></i>
                                </button>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    placeholder='Clave'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                Recordarme
                            </label>
                            <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
                        </div>

                        <button type="submit" className="login-button">Ingresar</button>

                        {/* <p className="signup-text">
                            ¿No posee una cuenta? <a href="#">Sign up</a>
                        </p> */}
                    </form>
                </div>
            </div>
        </div>
    );
}
