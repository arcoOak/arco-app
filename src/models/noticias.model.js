import pool from '../config/db.config.js';

const getAllNoticiasDB = async (id_club) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_noticia, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM noticias ntc
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_club = ? ORDER BY ntc.fecha_publicacion DESC
        `, [id_club]);
        return noticias;
    } catch (error) {
        console.error('Error al obtener todas las noticias:', error);
        throw error;
    }
}

const getNoticiaPorIdDB = async (id_club, id_noticia) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_noticia, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM noticias ntc
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_noticia = ? AND ntc.id_club = ?`, [id_noticia, id_club]
        );
        return noticias;
    } catch (error) {
        console.error('Error al obtener noticias por categoría:', error);
        throw error;
    }
}

const getUltimasNoticiasDB = async (id_club) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_noticia, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM noticias ntc
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_club = ? ORDER BY ntc.fecha_publicacion DESC LIMIT 5
        `, [id_club]);
        return noticias;
    } catch (error) {
        console.error('Error al obtener las últimas noticias:', error);
        throw error;
    }
}

const getNoticiasPorCategoriaDB = async (id_club, id_categoria) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_noticia, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM noticias ntc
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_categoria = ? AND ntc.id_club = ? ORDER BY ntc.fecha_publicacion DESC
        `, [id_categoria, id_club]
        );
        return noticias;
    } catch (error) {
        console.error('Error al obtener noticias por categoría:', error);
        throw error;
    }
}

const getNoticiasPorMesAnhoDB = async (mes, anho, id_club) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_noticia, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM noticias ntc
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE MONTH(ntc.fecha_publicacion) = ? AND YEAR(ntc.fecha_publicacion) = ? AND ntc.id_club = ?
            ORDER BY ntc.fecha_publicacion DESC
            `,
            [mes, anho, id_club]
        );
        return noticias;
    } catch (error) {
        console.error('Error al obtener noticias por mes:', error);
        throw error;
    }
}

const getCategoriasNoticiasDB = async(id_club)=>{
    try {
        const [categorias] = await pool.execute(`
            SELECT ntc.id_categoria, dcn.nombre_categoria_noticia
            FROM noticias ntc 
            JOIN data_categoria_noticia dcn ON dcn.id_categoria_noticia = ntc.id_categoria 
            WHERE id_club = ?
        `, [id_club]);
        return categorias;
        
    } catch (error) {
        console.error('Error al obtener categorías de noticias:', error);
        throw error;
    }
}

export {
    getAllNoticiasDB,
    getNoticiaPorIdDB,
    getUltimasNoticiasDB,
    getNoticiasPorCategoriaDB,
    getNoticiasPorMesAnhoDB,
    getCategoriasNoticiasDB
}