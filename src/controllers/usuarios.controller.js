import {
  getAllUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB,
  getUsuariosByRoleDB,
  updateContrasenaUsuarioDB
} from '../models/usuario.model.js';

async function getAllUsuarios(req, res) {
  try {
    const usuarios = await getAllUsuariosDB();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
  }
}

async function getUsuarioById(req, res) {
  try {
    const usuario = await getUsuarioByIdDB(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario' });
  }
}

async function createUsuario(req, res) {
  const { email, nombre, id_rol } = req.body;
  if (!email || !nombre || !id_rol) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const newUsuario = await createUsuarioDB(email, nombre, id_rol);
    res.status(201).json(newUsuario);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al crear usuario' });
  }
}

async function updateUsuario(req, res) {
  const { id } = req.params;
  const { email, nombre } = req.body;

  if (!email && !nombre) {
    return res.status(400).json({ message: 'Faltan datos para actualizar' });
  }

  try {
    const updatedRows = await updateUsuarioDB(id, nombre, email);
    if (!updatedRows) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(updatedRows);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al actualizar usuario' });
  }
}

async function deleteUsuario(req, res) {
  try {
    const deletedRows = await deleteUsuarioDB(req.params.id);
    if (deletedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al eliminar usuario' });
  }
}

async function getUsuariosByRole(req, res) {
  try {
    const usuarios = await getUsuariosByRoleDB(req.params.role);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al obtener usuarios por rol' });
  }
}

async function updateContrasenaUsuario(req, res) {
  try{
    const { id_usuario } = req.params;
    const { contrasena, contrasenaNueva } = req.body;

    if (!contrasena || !contrasenaNueva) {
      return res.status(400).json({ message: 'Faltan datos requeridos para actualizar la contraseña' });
    }

    const updatedRows = await updateContrasenaUsuarioDB(id_usuario, contrasena, contrasenaNueva);

  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al actualizar la contraseña del usuario' });
  }
}

export default {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosByRole,
  updateContrasenaUsuario
};