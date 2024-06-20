// codigo_utilidades.js
const axios = require('axios');

// Función para obtener elementos desde la ruta que genera flask
async function obtenerPagosDelAlumno(matricula) {
    try {
        const url = `https://api-flask-mensajes-wwjs-1.onrender.com/pagos/${encodeURIComponent(matricula)}`;
        const response = await axios.get(url);
        console.log(response)
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}

// Función para obtener las matriculas con pago en un JSON
async function obtenerMatriculasConPagoEsteMes() {
    try {
        const response = await axios.get('https://api-flask-mensajes-wwjs-1.onrender.com/alumnos_con_pago_mes_actual');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}

// Función para obtener las nombre,apellidos y matricula de todos los alumnos con pago en un JSON
async function obtenerDatosDeAlumnos() {
    try {
        const response = await axios.get('https://api-flask-mensajes-wwjs-1.onrender.com/alumnos');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}


module.exports = { obtenerPagosDelAlumno, obtenerMatriculasConPagoEsteMes, obtenerDatosDeAlumnos };