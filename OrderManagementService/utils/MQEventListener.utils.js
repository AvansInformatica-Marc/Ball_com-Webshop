const amqp = require('amqplib/callback_api');

const {
  orderCreate,
  orderUpdate,
  orderDelete,
} = require('../controllers/orderDenormalizer.controller');

const { MQ_URL } = process.env;
const queue = 'order';

amqp.connect(MQ_URL, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;
    console.info('Connected to RabbitMQ');

    channel.assertQueue(queue, { durable: false });

    channel.consume(
      queue,
      (message) => {
        try {
          const { eventType, order } = JSON.parse(message.content.toString());

          switch (eventType) {
            case 'createOrder':
              orderCreate(order);
              break;
            case 'updateOrder':
              orderUpdate(order);
              break;
            case 'deleteOrder':
              orderDelete(order);
              break;
            default:
              console.warning('Event Type Unknown');
              break;
          }
        } catch (notJsonException) {
          console.warning(notJsonException);
        }
      },
      { noAck: true }
    );
  });
});
