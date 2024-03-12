//CONSTANTE PARA GENERAR UN CODIGO QR EN LA TERMINAL
const Qr = require('qrcode-terminal');

//CONSTANTES PARA CONECTAR CON WHATSAPP WEB
const { Client } = require('whatsapp-web.js');
const client = new Client();


//PRUEBA DE OBTENCIOMN DE DATOS
// archivo_principal.js
const { buscarAlumnoPorNombre } = require('./respuestasApi.js'); // Importar la función desde el archivo



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

//Si el mensaje es pagos envia un mensaje
client.on('message', async (message) => {
    if (message.body === 'Ana') {
        buscarAlumnoPorNombre('Ana')
            .then(alumno => {
                console.log(alumno); // Imprimir los datos del alumno encontrado
            })
            .catch(error => {
                console.error(error.message); // Manejar cualquier error que ocurra al buscar el alumno
            });
        await message.reply('Este es el dettalle de tus pagos /debes mucho dinero de las colegiaturas')
    }
});

client.on('message', async (message) => {
    if (message.body === '!ping') {
        await client.sendMessage(message.form, 'pong');
    }
});
client.initialize();