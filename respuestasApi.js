// codigo_utilidades.js
const axios = require('axios');

// Función para obtener elementos desde la ruta que genera flask
async function obtenerAlumnos() {
    try {
        const response = await axios.get('http://localhost:5000/alumnos');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener elementos: ${error.message}`);
    }
}


async function buscarAlumnoPorNombre(nombreBuscado) {
    try {
        // Llamar a la función obtenerAlumnos() de manera asíncrona
        const datos = await obtenerAlumnos();

        // Encontrar el alumno con el nombre buscado
        const alumnoBuscado = datos.alumnos.find(alumno => alumno.nombre === nombreBuscado);
        return alumnoBuscado; // Devolver el alumno encontrado
    } catch (error) {
        throw new Error(`Error al buscar alumno: ${error.message}`); // Manejar cualquier error que ocurra al obtener los datos
    }
}
buscarAlumnoPorNombre('Ana')
    .then(alumno => {
        console.log(alumno); // Imprimir los datos del alumno encontrado
    })
    .catch(error => {
        console.error(error.message); // Manejar cualquier error que ocurra al buscar el alumno
    });

module.exports = { obtenerAlumnos };