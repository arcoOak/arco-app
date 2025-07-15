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
        if (username && password) {
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

    useEffect(() => {
        if (isAuthenticated) {
            // Si el usuario ya está autenticado, redirigir a la página principal
            navigate('/');
        }
    }, [])

    return (
        <>
            {showPostLoginPreloader && <Preloader />} {/* Muestra el preloader si showPostLoginPreloader es true */}


            <div className="app-logo-header">
                <img src="../src/img/logo.png" alt="App Logo" />
            </div>

            <div className="login-container" style={{ display: showPostLoginPreloader ? 'none' : 'block' }}>
                <div className="login-image">
                </div>
                <div className="login-form-area">
                    <h2>Iniciar Sesión</h2>
                    {/* <div className="social-icons">
                        <a href="https://api.whatsapp.com/send?phone=584249280933&amp;text=Buenas%21%20Tengo%20problemas%20para%20ingresar%20al%20sistema." target="_blank" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                        <a href="https://www.instagram.com/oaktreepos" target="_blank" title="Instagram"><i className="fab fa-instagram"></i></a>
                    </div> */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <div className='input-group'>
                                <button className='button-input'>
                                    <i className='fa fa-user'></i>
                                </button>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    placeholder="Usuario"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="input-field"
                                    tabIndex={1}
                                    autoComplete="on"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className='input-group'>
                                <button className='button-input'>
                                    <i className='fa fa-lock'></i>
                                </button>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    placeholder="Contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field"
                                    tabIndex={2}
                                    autoComplete="on"
                                />
                                <button className='button-input-eye'>
                                    <i className='fa fa-eye'></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                Recuérdame
                                <input
                                    type="checkbox"
                                />
                                <span className="checkmark"></span>
                            </label>
                            <a href="cambio_clave.php">¿Olvidaste tu Contraseña?</a>
                        </div>
                        <button type="submit" className="login-button" tabIndex={3}>Entrar</button>
                        <div id="msje" className="message-area">
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    </form>
                </div>
            </div>

            <LoadingModal visible={loading} mensaje='Validando...' ></LoadingModal>

            <footer className="footer">
                <p>© 2025 Oak Tree C.A.</p>
                <p>Todos los derechos reservados.</p>
                <p><a href="#">Política de Privacidad</a> | <a href="#">Términos de Uso</a></p>
            </footer>
        </>
    );
}

