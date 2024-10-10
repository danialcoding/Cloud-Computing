const amqp = require('amqplib');

const url = 'amqps://rqcszhcr:5UfXiVn9ur2gRSt96frXRG6lcyh5p2_m@puffin.rmq2.cloudamqp.com/rqcszhcr';

async function receiveOnAmqp() {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await amqp.connect(url);
            console.log('Connected to RabbitMQ');

            channel = await connection.createChannel();
            console.log('Channel created');

            const queue = 'msgqueue';
            await channel.assertQueue(queue, { durable: true });
            console.log(`Waiting for messages in "${queue}"`);

            channel.consume(queue,(msg) => {
                if (msg != null) {
                    const messageContent = msg.content.toString();
                    console.log(`Received message: ${messageContent}`);
                    channel.ack(msg)
                    resolve(messageContent);

                    setTimeout(async () => {
                        await connection.close();
                        console.log('Connection closed');
                    }, 500);
                } else {
                    resolve(null);
                }
            });
        } catch (err) {
            //console.error('Error connecting to RabbitMQ: ', err);
            throw new Error('Error connecting to RabbitMQ: ',err);
            //reject(err);
        }
    });
}

module.exports = {
    receiveOnAmqp,
};
