import {
  getAllSociosDB,
  getSocioByIdDB,
  createSocioDB,
  updateSocioDB,
  deleteSocioDB,
  getSocioByUsuarioDB
} from '../models/socio.model.js';

async function getAllSocios(req, res) {
  try {
    const socios = await getAllSociosDB();
    res.json(socios);
  } catch (error) {
    console.error('Error al obtener socios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener socios' });
  }
}

async function getSocioById(req, res) {
  try {
    const socio = await getSocioByIdDB(req.params.id);
    if (!socio) return res.status(404).json({ message: 'Socio no encontrado' });
    res.json(socio);
  } catch (error) {
    console.error(`Error al obtener socio con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener socio' });
  }
}

async function createSocio(req, res) {
  const { id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero } = req.body;
  if (!id_usuario || !nombre || !apellido || !documento_identidad || !fecha_nacimiento || !telefono || !direccion || !id_genero) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  try {
    const socioCreado = await createSocioDB({ id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero });
    res.status(201).json({ message: 'Socio creado exitosamente', socio: socioCreado });
  } catch (error) {
    console.error('Error al crear socio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Documento de identificación ya existe' });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear socio' });
  }
}

async function updateSocio(req, res) {
  const socioId = req.params.id;
  const { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero } = req.body;
  console.log(`Actualizando socio con ID: ${socioId}`, req.body);
  if (!nombre && !apellido && !documento_identidad && !fecha_nacimiento && !telefono && !direccion && !id_genero) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }
  try {
    const socioActualizado = await updateSocioDB(socioId, { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero });
    if (!socioActualizado) {
      return res.status(404).json({ message: 'Socio no encontrado para actualizar' });
    }
    res.json(socioActualizado);
  } catch (error) {
    console.error(`Error al actualizar socio con ID ${socioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar socio' });
  }
}

async function deleteSocio(req, res) {
  const socioId = req.params.id;
  try {
    const socioEliminado = await deleteSocioDB(socioId);
    if (socioEliminado.affectedRows === 0) {
      return res.status(404).json({ message: 'Socio no encontrado para eliminar' });
    }
    res.json({ message: 'Socio eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar socio con ID ${socioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar socio' });
  }
}

async function getSocioByUsuario(req, res) {
  const usuarioId = req.params.user;
  try {
    const socio = await getSocioByUsuarioDB(usuarioId);
    if (!socio) {
      return res.status(404).json({ message: 'Socio no encontrado' });
    }
    res.json(socio);
  } catch (error) {
    console.error(`Error al obtener socio con id usuario ${usuarioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario' });
  }
}

export default {
  getAllSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
  getSocioByUsuario,
};