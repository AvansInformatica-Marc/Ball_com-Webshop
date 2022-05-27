const Payment = require('../models/payment.model');
const MQService = require('../utils/MQService.utils');

const paymentCreate = (req, res, next) => {
  const paymentNew = new Payment({
    orderId: req.body.orderId,
    customerId: req.body.customerId,
    amount: req.body.amount,
    completed: req.body.completed,
  });

  paymentNew.save(async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'payment',
      JSON.stringify({ eventType: 'createPayment', payment: paymentNew })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({ eventType: 'createPayment', payment: paymentNew })
    );
    return res.status(200).json(paymentNew).end();
  });
};

const paymentUpdate = async (req, res, next) => {
  Payment.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'payment',
      JSON.stringify({
        eventType: 'updatePayment',
        payment: { _id: req.params.id, ...req.body },
      })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({
        eventType: 'updatePayment',
        payment: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const paymentDelete = (req, res, next) => {
  Payment.findByIdAndRemove(req.params.id, async (err, payment) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'payment',
      JSON.stringify({ eventType: 'deletePayment', payment })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({ eventType: 'deletePayment', payment })
    );
    return res.status(200).json('payment removed.').end();
  });
};

module.exports = {
  paymentCreate,
  paymentUpdate,
  paymentDelete,
};
