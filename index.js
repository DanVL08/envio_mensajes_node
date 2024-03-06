const Qr = require('qrcode-terminal');
const {Client} = require ('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
    Qr.generate(qr, {small: true});
});

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
    if (message.body === 'pagos') {
        await message.reply ('Este es el dettalle de tus pagos /debes mucho dinero de las colegiaturas')
    }
});

client.on('message', async(message) => {
    if (message.body ==='!ping') {
        await client.sendMessage(message.form, 'pong');
    }
});
client.initialize();