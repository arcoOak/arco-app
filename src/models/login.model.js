import { response } from 'express';
import connectToDatabase from '../config/db.config.js';
import bcrypt from 'bcryptjs';

const getLoginDB = async (username, password) => {
    let connection;
    try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT a.*, b.*, c.nombre_genero FROM usuarios a LEFT JOIN socios b ON a.id_usuario = b.id_socio LEFT JOIN data_genero c ON b.id_genero = c.id_genero WHERE a.email = ? AND a.activo = 1`, [username]
    );

    const user = rows[0];

    // const hash = await bcrypt.hash('test', 10);
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
        nombre: user.nombre,
        apellido: user.apellido,
        documento_identidad: user.documento_identidad,
        fecha_nacimiento: user.fecha_nacimiento,
        telefono: user.telefono,
        direccion: user.direccion,
        id_genero: user.id_genero,
        nombre_genero: user.nombre_genero,
        response: true,
      };
    }else{
      return {response: false}; // usuario no encontrado o contraseña incorrecta
    }
  } finally {
    if (connection) connection.end();
  }
}


export { getLoginDB };