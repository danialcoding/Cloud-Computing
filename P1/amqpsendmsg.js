const amqp = require('amqplib');

const url = 'amqps://rqcszhcr:5UfXiVn9ur2gRSt96frXRG6lcyh5p2_m@puffin.rmq2.cloudamqp.com/rqcszhcr';

async function sendOnAmqp(msg) {
    try {
        const connection = await amqp.connect(url);
        console.log('Connected to RabbitMQ');

        const channel = await connection.createChannel();
        console.log('Channel created');

        const queue = 'msgqueue';
        await channel.assertQueue(queue, { durable: true });
        console.log(`Queue "${queue}" created`);

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(`Message sent: ${msg}`);

        setTimeout(() => {
            connection.close();
            console.log('Connection closed');
        }, 500);
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

module.exports = {
    sendOnAmqp,
}
