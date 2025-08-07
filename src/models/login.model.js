import { response } from 'express';

// import {connectToDatabase, poolConection} from '../config/db.config.js';
import pool from '../config/db.config.js';

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

const getLoginDB = async (username, password) => {
    //let connection;
    try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.*, b.*, c.nombre_genero, d.id_tipo_socio, d.nombre_tipo_socio
      FROM usuarios a 
      LEFT JOIN socios b ON a.id_usuario = b.id_socio 
      LEFT JOIN data_genero c ON b.id_genero = c.id_genero 
      LEFT JOIN data_tipo_socio d ON b.id_tipo_socio = d.id_tipo_socio
      WHERE a.email = ? AND a.activo = 1`, 
      [username]
    );

    const user = rows[0];

    // const hash = await bcrypt.hash('test', SALT_ROUNDS);
    // console.log('Hash:', hash);

    // console.log('Usuario encontrado:', user);
    // console.log('Contraseña proporcionada:', password);
    // console.log('Contraseña almacenada (hash):', user.contrasena_hash);
    // console.log('Comparando contraseñas:', await bcrypt.compare(password, user.contrasena_hash));

    if (user && await bcrypt.compare(password, user.contrasena_hash)) {
      // login exitoso
      return {
        id_usuario: user.id_usuario,
        email: user.email,
        fecha_creacion: user.fecha_creacion,
        id_rol: user.id_rol,
        id_socio: user.id_socio,
        id_club: user.id_club,
        nombre: user.nombre,
        apellido: user.apellido,
        documento_identidad: user.documento_identidad,
        fecha_nacimiento: user.fecha_nacimiento,
        telefono: user.telefono,
        direccion: user.direccion,
        id_genero: user.id_genero,
        nombre_genero: user.nombre_genero,
        response: true,
        id_tipo_socio: user.id_tipo_socio,
        nombre_tipo_socio: user.nombre_tipo_socio,
      };
    }else{
      return {response: false}; // usuario no encontrado o contraseña incorrecta
    }
  } finally {
    //if (connection) connection.end();
  }
}


export { getLoginDB };