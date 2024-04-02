//CONSTANTE PARA GENERAR UN CODIGO QR EN LA TERMINAL
const Qr = require('qrcode-terminal');

//CONSTANTES PARA CONECTAR CON WHATSAPP WEB
const { Client, LocalAuth} = require('whatsapp-web.js');
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

//GENERAR QR EN TERMINAL
client.on('qr', (qr) => {
    Qr.generate(qr, { small: true });
});

//CUANDO EL CLIENTE ESTA LISTO
client.on('ready', async () => {
    console.log('Client is ready!');
    enviarMensaje("524471389071", "Holaaaaaaaaaaa")
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
    const numero = numeroDeTelefono; 
    const texto = textoDelMensaje;

    try {
        const phoneRegistered = await client.getNumberId(numero);
        await client.sendMessage(phoneRegistered._serialized, texto);
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
    }
}