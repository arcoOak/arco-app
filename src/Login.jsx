import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; // Asegúrate de tener un archivo CSS para los estilos
import Preloader from './components/Preloader';

import { useAuth } from "./context/AuthContext"; // Importa el contexto de autenticación

import LoadingModal from './components/modals/LoadingModal'; // Importa el modal de carga

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPostLoginPreloader, setShowPostLoginPreloader] = useState(false); // Nuevo estado para el preloader post-login
    const navigate = useNavigate();

    const { user, login, logout, isAuthenticated, loading } = useAuth();

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setError(''); // Limpiar errores previos

        // Lógica de autenticación simple (sustituir con una API real)
        if (username  && password ) {
            const success = await login(username, password); // Espera el resultado
            //console.log('Login attempt:', { username, password, success });
            if (success) {
                navigate('/'); // Redirige a la página principal después del login
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    useEffect(()=>{
        if (isAuthenticated) {
            // Si el usuario ya está autenticado, redirigir a la página principal
            navigate('/');
        }
    },[])

    

    return (
        <>

            {showPostLoginPreloader && <Preloader />} {/* Muestra el preloader si showPostLoginPreloader es true */}

            <div className="login-page"  style={{ display: showPostLoginPreloader ? 'none' : 'block' }}>
                <div className="login-card">
                    <img src="./src/img/logo.png" alt="logo" />

                    <h2 className="welcome-title">Bienvenido</h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="username" className="input-label">Usuario</label>
                            <div className="input-control">
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    placeholder="johnroria"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password" className="input-label">Clave</label>
                            <div className="input-control password-input">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    placeholder="**********"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <button type="button" className="password-toggle" aria-label="Show password">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 12S6 4 12 4C18 4 22 12 22 12S18 20 12 20C6 20 2 12 2 12Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="sign-in-button">Entrar</button>

                        <a href="#" className="forgot-password">¿Olvidaste tu Clave?</a>

                        <div className="or-divider">
                            <span className="line"></span>
                            <span className="or-text">O</span>
                            <span className="line"></span>
                        </div>

                        <div className="social-login">
                            <button className="social-button google">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.782 10.151C19.782 9.516 19.727 8.878 19.619 8.243H10V11.849H15.405C15.111 13.398 14.153 14.654 12.825 15.498V17.925H15.908C17.794 16.143 18.887 13.666 19.782 10.151Z" fill="#4285F4" />
                                    <path d="M10 20C12.784 20 15.176 19.117 16.963 17.659L15.908 17.925C14.739 18.665 13.235 19.167 10 19.167C5.474 19.167 1.698 16.03 0.354 11.666L3.626 9.176C4.425 11.236 7.07 14.167 10 14.167C11.667 14.167 13.063 13.714 14.07 13.013V15.75L16.963 17.659Z" fill="#34A853" />
                                    <path d="M0.354 11.666C0.187 11.127 0.088 10.57 0.088 10C0.088 9.43 0.187 8.873 0.354 8.334L3.626 10.824L0.354 11.666Z" fill="#FBBC05" />
                                    <path d="M10 0.833C12.181 0.833 13.916 1.636 15.177 2.809L16.963 1.341C15.176 -0.117 12.784 -0.833 10 -0.833C5.474 -0.833 1.698 2.299 0.354 6.663L3.626 9.153C4.425 7.093 7.07 4.162 10 4.162C11.667 4.162 13.063 4.615 14.07 5.316L16.963 3.407L15.177 2.809Z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="social-button facebook">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.7813 10.0001C17.7813 5.48514 14.3758 1.83337 10.0003 1.83337C5.62483 1.83337 2.2193 5.48514 2.2193 10.0001C2.2193 14.1951 5.30514 17.5918 9.3005 17.9715V11.5834H7.07287V10.0001H9.3005V8.71887C9.3005 6.57021 10.596 5.33337 12.5936 5.33337C13.5654 5.33337 14.3802 5.40204 14.654 5.43896V7.48567H13.6268C12.5714 7.48567 12.3397 8.11867 12.3397 8.87896V10.0001H14.5447L14.1963 11.5834H12.3397V17.9715C16.3351 17.5918 17.7813 14.1951 17.7813 10.0001Z" fill="#1877F2" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <LoadingModal visible={loading} mensaje='Validando...' ></LoadingModal>

        </>
    );
}

