
const API_HOST = import.meta.env.VITE_API_HOST;


const loginApi = async (username, password) => {
    const response = await fetch(`${API_HOST}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    console.log('Login response:', response);
    return await response.json();
}

const logoutApi = async () => {
    //navigate('/login'); // Redirigir al login después de cerrar sesión
}


export default {
    loginApi, logoutApi
};
