//CONSTANTE PARA GENERAR UN CODIGO QR EN LA TERMINAL
const Qr = require('qrcode-terminal');

//CONSTANTES PARA CONECTAR CON WHATSAPP WEB
const {Client} = require ('whatsapp-web.js');
const client = new Client();


//PRUEBA DE OBTENCIOMN DE DATOS
// archivo_principal.js
const { obtenerAlumnos } = require('./respuestasApi.js');


// Llamar a la función para obtener elementos
async function main() {
    try {
        const elementos = await obtenerAlumnos();
        console.log('Elementos:', elementos);
    } catch (error) {
        console.error(error.message);
    }
}

// Llamar a la función principal
main();


//GENERAR QR EN TERMINAL
client.on('qr', (qr) => {
    Qr.generate(qr, {small: true});
});

//CUANDO EL CLIENTE ESTA LISTO
client.on('ready', async() => {
    console.log('Client is ready!');

    const number = "524471389071";
    const text = "Hey I'm ready!";
    const phoneRegistered = await client.getNumberId(number);
    await client.sendMessage(phoneRegistered._serialized, text);

});

//Cuando el cliente recibe un mensaje, este se muestra en la consola
client.on('message', (message) => {
    console.log(message.body);
});

//Si el mensaje es pagos envia un mensaje
client.on('message', async(message) => {
    if (message.body === 'A67-90-01') {
        await message.reply ('Este es el dettalle de tus pagos /debes mucho dinero de las colegiaturas')
    }
});

client.on('message', async(message) => {
    if (message.body ==='!ping') {
        await client.sendMessage(message.form, 'pong');
    }
});
client.initialize();