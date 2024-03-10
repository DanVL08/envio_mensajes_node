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

// Llamar a la función obtenerAlumnos() de manera asíncrona
obtenerAlumnos()
    .then(datos => {
        const datosJSON = JSON.stringify(datos); // Convertir los datos a JSON
        console.log(datosJSON); // Imprimir los datos en formato JSON
    })
    .catch(error => {
        console.error(error.message); // Manejar cualquier error que ocurra al obtener los datos
    });

/*function obtenerAlumnoPorNombre(nombreBuscado) {
    const datos = obtenerAlumnos(); // Llamada a la función que devuelve la estructura de datos
    
    // Buscar el alumno por su nombre
    const alumnoEncontrado = datos.alumnos.find(alumno => alumno.nombre === nombreBuscado);

    if (alumnoEncontrado) {
        // Formatear los datos del alumno como texto entendible
        const textoAlumno = `
            Nombre: ${alumnoEncontrado.nombre}
            Apellido: ${alumnoEncontrado.apellido1}
            Matrícula: ${alumnoEncontrado.matricula}
        `;
        return textoAlumno; // Devolver el texto formateado del alumno
    } else {
        return 'No se encontró ningún alumno con ese nombre.'; // Devolver un mensaje si no se encuentra ningún alumno con ese nombre
    }
}
const alumno = obtenerAlumnoPorNombre('Juan Diego');
console.log(alumno);
*/

module.exports = { obtenerAlumnos };