import {
    getDatosClubDB
} from '../models/club.model.js';

const getDatosClub = async (req, res) => {
    const { id_club } = req.params; // Asegúrate de que el id_club se pase como query parameter

    try {

        if (!id_club) {
            return res.status(400).json({ message: 'ID del club es requerido' });
        }

        const datosClub = await getDatosClubDB(id_club);
        res.json(datosClub);
    } catch (error) {
        console.error('Error al obtener datos del club:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener datos del club' });
    }
}

export default {
    getDatosClub

}