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
    /* webVersion: '2.2409.2', */
    /* webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
    } */
});



//PRUEBA DE OBTENCIOMN DE DATOS
// archivo_principal.js
const { obtenerPagosDelAlumno } = require('./respuestasApi.js'); // Importar la función desde el archivo
const { obtenerArrayDeAlumnosSinPagoEsteMes } = require('./datosDePagos.js');
const logger = require('./logger.js');
//GENERAR QR EN TERMINAL
client.on('qr', (qr) => {
    Qr.generate(qr, { small: true });
});

//CUANDO EL CLIENTE ESTA LISTO
client.on('ready', async () => {
    logger.info('Client is ready!');
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
        logger.error(error.message); // Manejar cualquier error que ocurra al buscar el alumno
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
        logger.error("Error al enviar el mensaje:", error);
    }
}

const MILISEGUNDOS_EN_UN_DIA = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const MILISEGUNDOS_EN_UN_MINUTO = 60 * 1000; // 60 segundos en milisegundos

// Función para obtener y enviar mensajes a los alumnos sin pago
async function enviarMensajeALosAlumnosSinPago() {
    const alumnosSinPago = await obtenerArrayDeAlumnosSinPagoEsteMes();
    if (!alumnosSinPago || alumnosSinPago.length === 0) {
        logger.info("No hay alumnos sin pago este mes. Avanzando al próximo mes.");
    } else {
        logger.info(`Se encontraron ${alumnosSinPago.length} alumnos sin pago este mes.`);
        for (const alumno of alumnosSinPago) {
            logger.info(`Enviando mensaje a: ${alumno.nombre}`);
            const mensaje = `Hola ${alumno.nombre}, esperando que se encuentre muy bien, le saluda la Preparatoria Federal por Coperación. ` +
                `Le invitamos a realizar el pago correspondiente de este mes. Si ya realizó su pago, por favor infórmelo a nuestras oficinas. ¡Saludos!`;

            // Esperar 3 minutos antes de enviar el mensaje
            await esperar(180000); // 180000 milisegundos = 3 minutos
            await enviarMensaje(alumno.telefono, mensaje);
        }
    }
}

// Función principal para activar en un día y hora específicos
async function activarEnDiaYHoraEspecificos(fechaInicial) {
    let fechaProximaActivacion = fechaInicial;

    while (true) {
        const ahora = new Date();

        if (ahora >= fechaProximaActivacion) {
            logger.info("La función se activó en la fecha y hora específicas.");
            await enviarMensajeALosAlumnosSinPago();
            await avanzarUnMes(fechaProximaActivacion);
            fechaProximaActivacion.setMonth(fechaProximaActivacion.getMonth() + 1);
            logger.info(`Fecha actualizada para la próxima activación: ${fechaProximaActivacion}`);
        }

        const tiempoRestante = fechaProximaActivacion.getTime() - ahora.getTime();
        logger.info(`Esperando hasta la próxima fecha y hora específicas (${tiempoRestante} ms restantes)...`);
        await esperar(Math.min(tiempoRestante, MILISEGUNDOS_EN_UN_MINUTO)); // Esperar hasta la próxima fecha o 1 minuto, lo que sea menor
    }
}

// Función para avanzar la fecha al próximo mes
async function avanzarUnMes(fecha) {
    fecha.setMonth(fecha.getMonth() + 1);
    logger.info('Fecha actualizada al próximo mes: ' + fecha);
}

// Función auxiliar para esperar
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicializar el proceso de activación
const fechaInicial = new Date(2024, 5, 19, 21, 42, 0); // Ejemplo: 19 de junio de 2024 a las 21:42:00
activarEnDiaYHoraEspecificos(fechaInicial)
    .catch(error => logger.error("Error:" + error));
