//CONSTANTE PARA GENERAR UN CODIGO QR EN LA TERMINAL
const Qr = require('qrcode-terminal');

//CONSTANTES PARA CONECTAR CON WHATSAPP WEB
const { Client, LocalAuth} = require('whatsapp-web.js');
const client = new Client({ //cliente
    /*   puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }, */
      authStrategy: new LocalAuth()
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




client.on('message', async (message) => {
    if (message.body === '!ping') {
        await client.sendMessage(message.form, 'pong');
    }
});
client.initialize();