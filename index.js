// Importa los módulos necesarios
const express = require('express');
const Qr = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { obtenerPagosDelAlumno } = require('./respuestasApi.js');
const { obtenerArrayDeAlumnosSinPagoEsteMes } = require('./datosDePagos.js');
const logger = require('./logger.js');

const app = express();
const port = process.env.PORT || 3000;

// Configura el cliente de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Genera un QR en la terminal para iniciar sesión
client.on('qr', (qr) => {
    Qr.generate(qr, { small: true });
});

// Cuando el cliente está listo
client.on('ready', async () => {
    logger.info('Client is ready!');
});

// Escucha los mensajes y responde
client.on('message', async (message) => {
    try {
        const pagos_alumno = await obtenerPagosDelAlumno(message.body);
        let texto = `Datos del alumno:\nApellido: ${pagos_alumno.apellido1}\nNombre: ${pagos_alumno.nombre}\nPagos realizados:`;
        pagos_alumno.pagos.forEach((pago, index) => {
            texto += `\n- Pago ${index + 1}:\n  Estado: ${pago.estado_pago}\n  Fecha: ${pago.fecha_pago}\n  Monto: ${pago.monto}`;
        });
        await message.reply(`Hola ${pagos_alumno.nombre}, aquí están tus datos:\n${texto}`);
    } catch (error) {
        logger.error(error.message);
        await message.reply('Ha ocurrido un error buscando tus datos. Por favor, inténtalo de nuevo más tarde.');
    }
});

// Inicializa el cliente de WhatsApp Web
client.initialize();

// Endpoint para mantener el puerto abierto
app.get('/', (req, res) => {
    res.send('Service is up and running');
});

// Servidor HTTP que mantiene el puerto abierto
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Lógica de envío de mensajes (sin cambios)
async function enviarMensaje(numeroDeTelefono, textoDelMensaje) {
    const numero = '52' + numeroDeTelefono;
    const texto = textoDelMensaje;
    try {
        const phoneRegistered = await client.getNumberId(numero);
        await client.sendMessage(phoneRegistered._serialized, texto);
    } catch (error) {
        logger.error("Error al enviar el mensaje:", error);
    }
}

// Función principal para enviar mensajes a alumnos sin pago
async function enviarMensajeALosAlumnosSinPago() {
    const alumnosSinPago = await obtenerArrayDeAlumnosSinPagoEsteMes();
    if (!alumnosSinPago || alumnosSinPago.length === 0) {
        logger.info("No hay alumnos sin pago este mes. Avanzando al próximo mes.");
    } else {
        logger.info(`Se encontraron ${alumnosSinPago.length} alumnos sin pago este mes.`);
        for (const alumno of alumnosSinPago) {
            logger.info(`Enviando mensaje a: ${alumno.nombre}`);
            const mensaje = `Hola ${alumno.nombre}, esperando que se encuentre muy bien le saluda Preparatoria Federal por Coperación. Le invitamos a realizar el pago correspondiente de este mes. Si ya realizó su pago, por favor infórmelo a nuestras oficinas. ¡Saludos!`;
            await esperar(180000); // Espera 3 minutos
            await enviarMensaje(alumno.telefono, mensaje);
        }
    }
}

// Función para activar en una fecha específica
async function activarEnDiaYHoraEspecificos(fecha) {
    while (true) {
        const ahora = new Date();
        if (ahora >= fecha) {
            logger.info("La función se activó en la fecha y hora específicas.");
            await enviarMensajeALosAlumnosSinPago();
            await avanzarUnDia(fecha);
            await esperar(24 * 60 * 60 * 1000); // Espera un día
        } else {
            const tiempoRestante = fecha.getTime() - ahora.getTime();
            await esperar(Math.min(tiempoRestante, 60 * 1000)); // Espera hasta la fecha o un minuto
        }
    }
}

async function avanzarUnDia(fecha) {
    fecha.setDate(fecha.getDate() + 1);
    logger.info("Fecha actualizada al próximo día: " + fecha);
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//Endpoint de salud
app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

// Simula una petición cada minuto para mantener la instancia activa
const axios = require('axios');

setInterval(() => {
    axios.get(`http://localhost:${port}/health`)
        .then(response => console.log('Health check:', response.data))
        .catch(error => console.error('Error en health check:', error));
}, 60000); // 60,000 ms = 1 minuto

// Inicia la activación en una fecha específica
const fechaInicial = new Date(2024, 5, 24, 10, 1, 0);
activarEnDiaYHoraEspecificos(fechaInicial).catch(error => logger.error("Error:" + error));
