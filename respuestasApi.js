// codigo_utilidades.js
const axios = require('axios');

// Función para obtener elementos desde la ruta que genera flask
async function obtenerPagosDelAlumno(matricula) {
    try {
        const response = await axios.get('http://localhost:5000/pagos/' + encodeURIComponent(matricula));
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}

module.exports = { obtenerPagosDelAlumno };