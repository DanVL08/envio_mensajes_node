//CONSTANTE PARA GENERAR UN CODIGO QR EN LA TERMINAL
const Qr = require('qrcode-terminal');

//CONSTANTES PARA CONECTAR CON WHATSAPP WEB
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ //cliente
    authStrategy: new LocalAuth(),
    /*   puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
    },
        }, */
    webVersion: '2.2409.2',
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
    }
});



//PRUEBA DE OBTENCIOMN DE DATOS
// archivo_principal.js
const { obtenerPagosDelAlumno } = require('./respuestasApi.js'); // Importar la función desde el archivo
const { obtenerArrayDeAlumnosSinPagoEsteMes } = require('./datosDePagos.js')
//GENERAR QR EN TERMINAL
client.on('qr', (qr) => {
    Qr.generate(qr, { small: true });
});

//CUANDO EL CLIENTE ESTA LISTO
client.on('ready', async () => {
    console.log('Client is ready!');
    //LO COMENTO PARA DESCOMENTAR DESPUES Y NO MOLESTAR
    /* const number = "524471389071"; 
    const text = "Hey I'm ready!";
    const phoneRegistered = await client.getNumberId(number);
    await client.sendMessage(phoneRegistered._serialized, text);
    */
});

//Cuando el cliente recibe un mensaje, este se muestra en la consola
client.on('message', (message) => {
    console.log(message.body);
});

//Si el encuentra un alumno envia un mensaje con los datos
// Archivo principal (por ejemplo, index.js)

client.on('message', async (message) => {
    try {
        const pagos_alumno = await obtenerPagosDelAlumno(message.body);

        //TEXTO FINAL A IMPRIMIR
        let texto = `Datos del alumno:
        Apellido: ${pagos_alumno.apellido1}
        Nombre: ${pagos_alumno.nombre}
        Pagos realizados:`;

        //Concatena cada uno de los datos del pago
        pagos_alumno.pagos.forEach((pago, index) => {
            texto += `
            - Pago ${index + 1}:
                Estado: ${pago.estado_pago}
                Fecha: ${pago.fecha_pago}
                Monto: ${pago.monto}`;
        });

        await message.reply(`Hola ${pagos_alumno.nombre}, aquí están tus datos:\n${texto}`);
    } catch (error) {
        console.error(error.message); // Manejar cualquier error que ocurra al buscar el alumno
        await message.reply('Ha ocurrido un error buscando tus datos. Por favor, inténtalo de nuevo más tarde.');
    }
});


client.initialize();

//UTILIZA EL CLIENTE PARA ENVIAR UN MENSAJE DE ACUERDO A LOS PARAMETROS
async function enviarMensaje(numeroDeTelefono, textoDelMensaje) {
    const numero = '52' + numeroDeTelefono; //AGREGA LA LADA DE MEXICO PARA PODER ENVIAR EL MENSAJE 
    const texto = textoDelMensaje;

    try {
        const phoneRegistered = await client.getNumberId(numero);
        await client.sendMessage(phoneRegistered._serialized, texto);
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
    }
}
async function enviarMensajeALosAlumnosSinPago() {
    // Iterando sobre el array e imprimiendo los nombres de todas las personas
    const alumnosSinPago = await obtenerArrayDeAlumnosSinPagoEsteMes();

    for (const alumno of alumnosSinPago) {
        console.log(alumno.nombre);
        const mensaje = "El alumno " + alumno.nombre + " no ha realizado su pago este mes";

        // Crear una promesa que se resolverá después de 3 minutos y luego envia un numero al telefono del alumno
        await new Promise(resolve => {
            setTimeout(async () => {
                await enviarMensaje(alumno.telefono, mensaje);
                resolve(); // Resuelve la promesa después de enviar el mensaje
            }, 180000); // 180000 milisegundos = 3 minutos
        });
    }
}


// Función asíncrona para activar en un día y hora específicos
async function activarEnDiaYHoraEspecificos(fecha) {
    // Definir la fecha y hora específicas en las que quieres activar la función
    const fechaEspecifica = fecha
    // Definir la fecha específica



    // Llamar a la función para avanzar un mes


    while (true) {
        // Obtener la fecha y hora actual
        const ahora = new Date();

        // Verificar si la fecha y hora actuales coinciden con la fecha y hora específicas
        if (ahora >= fechaEspecifica) {
            console.log("La función se activó en la fecha y hora específicas.");
            await enviarMensajeALosAlumnosSinPago();
            // Función para avanzar un mes
           async function avanzarUnMes() {
                fechaEspecifica.setMonth(fechaEspecifica.getMonth() + 1);
                console.log('Fecha actualizada:', fechaEspecifica);
            }

           await avanzarUnMes();
            //VOLVIENDO A LLAMAR A LA FUNCION
            activarEnDiaYHoraEspecificos(fechaEspecifica)
                .catch(error => console.error("Error:", error));
            break; // Salir del bucle una vez que se haya activado la función
        } else {
            // Calcular el tiempo que falta hasta la fecha y hora específicas
            const tiempoRestante = fechaEspecifica.getTime() - ahora.getTime();
            console.log(`Esperando hasta la fecha y hora específicas (${tiempoRestante} ms restantes)...`);

            // Esperar un tiempo antes de volver a verificar
            await esperar(1000); // Esperar 1 segundo antes de volver a verificar
        }
    }
}

// Función para esperar un tiempo determinado
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Llamar a la función para activar en un día y hora específicos
const fechaEspecifica = new Date(2024, 3, 19, 21, 42, 0);
/* activarEnDiaYHoraEspecificos(fechaEspecifica)
    .catch(error => console.error("Error:", error));
 */

