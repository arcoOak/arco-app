import connectToDatabase from '../config/db.config.js';
import bcrypt from 'bcryptjs';

const getLoginDB = async (username, password) => {
    let connection;
    try {
    connection = await connectToDatabase();
    const [user] = await connection.execute(
      `SELECT a.*, b.*, c.nombre_genero FROM usuarios a LEFT JOIN socios b ON a.id_usuario = b.id_socio LEFT JOIN data_genero c ON b.id_genero = c.id_genero WHERE a.email = ? AND a.activo = 1`, [username]
    );
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
        nombre_genero: user.nombre_genero,
      };
    }
  } finally {
    if (connection) connection.end();
  }
}


export { getLoginDB };