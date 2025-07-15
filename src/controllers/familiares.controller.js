import {
  getAllFamiliaresDB,
  getFamiliarByIdDB,
  createFamiliarDB,
  updateFamiliarDB,
  deleteFamiliarDB,
  getFamiliaresByUsuarioDB
} from '../models/familiar.model.js';

// Obtener todos los familiares
async function getAllFamiliares(req, res) {
  try {
    const familiares = await getAllFamiliaresDB();
    res.json(familiares);
  } catch (error) {
    console.error('Error al obtener familiares:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiares' });
  }
}

// Obtener familiar por ID
async function getFamiliarById(req, res) {
  try {
    const { id } = req.params;
    const familiar = await getFamiliarByIdDB(id);
    if (!familiar) return res.status(404).json({ message: 'Familiar no encontrado' });
    res.json(familiar);
  } catch (error) {
    console.error(`Error al obtener familiar con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiar' });
  }
}

// Crear familiar
async function createFamiliar(req, res) {
  const { id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco } = req.body;
  if (!id_usuario || !nombre || !apellido || !documento_identidad || !fecha_nacimiento || !telefono || !direccion || !id_genero || !id_parentesco) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  try {
    const familiarCreado = await createFamiliarDB({ id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco });
    res.status(201).json(familiarCreado);
  } catch (error) {
    console.error('Error al crear familiar:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Documento de identificación ya existe' });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear familiar' });
  }
}

// Actualizar familiar
async function updateFamiliar(req, res) {
  const familiarId = req.params.id;
  const { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco } = req.body;
  if (!nombre && !apellido && !documento_identidad && !fecha_nacimiento && !telefono && !direccion && !id_genero && !id_parentesco) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }
  try {
    const familiarActualizado = await updateFamiliarDB(familiarId, { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco });
    if (!familiarActualizado) {
      return res.status(404).json({ message: 'Familiar no encontrado para actualizar' });
    }
    res.json(familiarActualizado);
  } catch (error) {
    console.error(`Error al actualizar Familiar con ID ${familiarId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar familiar' });
  }
}

// Eliminar familiar
async function deleteFamiliar(req, res) {
  const familiarId = req.params.id;
  try {
    const affectedRows = await deleteFamiliarDB(familiarId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Familiar no encontrado para eliminar' });
    }
    res.json({ message: 'Familiar eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar Familiar con ID ${familiarId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar familiar' });
  }
}

// Obtener familiares por usuario
async function getFamiliaresByUsuario(req, res) {
  const usuarioId = req.params.user;
  try {
    const familiares = await getFamiliaresByUsuarioDB(usuarioId);
    if (!familiares || familiares.length === 0) {
      return res.status(404).json({ message: 'Familiares no encontrados' });
    }
    res.json(familiares);
  } catch (error) {
    console.error(`Error al obtener familiares con id usuario ${usuarioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiares' });
  }
}

export default {
  getAllFamiliares,
  getFamiliarById,
  createFamiliar,
  updateFamiliar,
  deleteFamiliar,
  getFamiliaresByUsuario,
};