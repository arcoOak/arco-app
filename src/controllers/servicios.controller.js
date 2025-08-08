import {
    getTodosServiciosDB,
    getHomeServiciosDB,
    getTodasOfertasServiciosComercioDB,
    getCategoriasServiciosActivosDB,
    getServicioPorIdDB,
    getEmpresasReservadorasPorServicioDB,
    getServiciosPorEmpresaReservadoraDB,
    getCategoriasServiciosActivosPorEmpresaReservadoraDB
} from '../models/servicios.model.js';

const getTodosServicios = async (req, res) => {
    try {
        const { id_club } = req.params;
        const servicios = await getTodosServiciosDB(id_club);
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getHomeServicios = async (req, res) => {
    try {
        const { id_club } = req.params;
        const servicios = await getHomeServiciosDB(id_club);
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getTodasOfertasServiciosComercio = async (req, res) =>{
    try{

        const { id_club} = req.params;
        const ofertas = await getTodasOfertasServiciosComercioDB(id_club);
        res.json(ofertas);

    }catch (error){
        res.status(500).json({ error: error.message });
    }
}

const getCategoriasServiciosActivos = async (req, res) =>{
    try {
        const { id_club } = req.params;
        const categorias = await getCategoriasServiciosActivosDB(id_club);
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getServicioPorId = async (req, res) => {
    try {
        const { id_servicio } = req.params;
        const servicio = await getServicioPorIdDB(id_servicio);
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getEmpresasReservadorasPorServicio = async (req, res) => {
    try {
        const { id_servicio } = req.params;
        const empresas = await getEmpresasReservadorasPorServicioDB(id_servicio);
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

const getServiciosPorEmpresaReservadora = async (req, res) => {
    try {
        const { id_empresa } = req.params;
        const servicios = await getServiciosPorEmpresaReservadoraDB(id_empresa);
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCategoriasServiciosActivosPorEmpresaReservadora = async (req, res) => {
    try {
        const { id_empresa } = req.params;
        const categorias = await getCategoriasServiciosActivosPorEmpresaReservadoraDB(id_empresa);
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default {
    getTodosServicios,
    getHomeServicios,
    getTodasOfertasServiciosComercio,
    getCategoriasServiciosActivos,
    getServicioPorId,
    getEmpresasReservadorasPorServicio,
    getServiciosPorEmpresaReservadora,
    getCategoriasServiciosActivosPorEmpresaReservadora
}