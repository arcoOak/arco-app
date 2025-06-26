import { useNavigate } from "react-router-dom";

const loginApi = async (username, password) => {
    const response = await fetch('/api/login', { /* ... */ });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
}

const logoutApi = async () => {
    //navigate('/login'); // Redirigir al login después de cerrar sesión
}

export default {
    loginApi, logoutApi
};