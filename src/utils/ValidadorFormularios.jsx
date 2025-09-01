


const ValidadorFormularios = (listaDeCampos) => {
    const errors = {};
    for (const [key, value] of Object.entries(listaDeCampos)) {
        if (value === '' || value === null || value === undefined) {
            errors[key] = `El campo ${key} es obligatorio`;
        }
    }
    return errors;
};

export default ValidadorFormularios;

// Este componente es un validador de formularios que recibe una lista de campos y valida si están vacíos o no.
// Si un campo está vacío, se agrega un error al estado de errores con el nombre del campo.
// Este componente puede ser utilizado en otros componentes de formularios para validar los campos antes de enviarlos.