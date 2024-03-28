const { obtenerMatriculasConPagoEsteMes, obtenerDatosDeAlumnos } = require('./respuestasApi.js');
// Llamada a la función
async function obtenerArrayDeMatriculasConPagoEsteMes() {
    try {
        // Llamada a la función para obtener las matrículas con pago del mes actual
        const matriculasConPago = await obtenerMatriculasConPagoEsteMes();

        // Almacena el array de matrículas en una variable que contiene el objeto especifico en el JSON
        const arrayDeMatriculas = matriculasConPago.matriculas_con_pago_mes_actual;

        // Ahora puedes trabajar con el arrayDeMatriculas como desees
        return arrayDeMatriculas;
    } catch (error) {
        console.error(error.message);
    }
}

async function obtenerArrayDeMatriculasSinPagoEsteMes(){
    try {
        // Obtener los datos de los alumnos
        const datosDeAlumnos = await obtenerDatosDeAlumnos();
        const ArrayDeMatriculasConPago = await obtenerArrayDeMatriculasConPagoEsteMes();
        let arrayDeMatriculasSinPagoEsteMes = [];
        // Buscar cada matricula dentro de las  matrículas con pago
        datosDeAlumnos.alumnos.forEach(alumno => {
            if (!(ArrayDeMatriculasConPago.includes(alumno.matricula))) {
                arrayDeMatriculasSinPagoEsteMes.push(alumno.matricula);
            }
        });
        return arrayDeMatriculasSinPagoEsteMes;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {obtenerArrayDeMatriculasSinPagoEsteMes}