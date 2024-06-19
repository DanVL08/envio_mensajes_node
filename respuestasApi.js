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

// Función para obtener las matriculas con pago en un JSON
async function obtenerMatriculasConPagoEsteMes() {
    try {
        const response = await axios.get('http://localhost:5000/alumnos_con_pago_mes_actual');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}

// Función para obtener las nombre,apellidos y matricula de todos los alumnos con pago en un JSON
async function obtenerDatosDeAlumnos() {
    try {
        const response = await axios.get('http://localhost:5000/alumnos');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}


module.exports = { obtenerPagosDelAlumno, obtenerMatriculasConPagoEsteMes, obtenerDatosDeAlumnos };