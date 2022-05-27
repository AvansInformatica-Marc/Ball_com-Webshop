const amqp = require('amqplib/callback_api');

const {
  paymentCreate,
  paymentUpdate,
  paymentDelete,
} = require('../controllers/paymentDenormalizer.controller');

const { MQ_URL } = process.env;
const queue = 'payment';

amqp.connect(MQ_URL, (connectionError, connection) => {
  if (connectionError) throw connectionError;
  // Idempotent: Only creates the channel when it doesn't exist
  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;
    console.info('Connected to RabbitMQ');

    channel.assertQueue(queue, { durable: false });

    // Subscribe to the channel
    channel.consume(
      queue,
      (message) => {
        try {
          const { eventType, payment } = JSON.parse(
            message.content.toString()
          );

          switch (eventType) {
            case 'createPayment':
              paymentCreate(payment);
              break;
            case 'updatePayment':
              paymentUpdate(payment);
              break;
            case 'deletePayment':
              paymentDelete(payment);
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
