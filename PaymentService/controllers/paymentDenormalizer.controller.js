/* eslint-disable no-underscore-dangle */
const PaymentRead = require('../models/paymentRead.model');

const paymentCreate = (payment) => {
  const paymentNew = new PaymentRead(payment);

  paymentNew.save((err) => {
    if (err) console.error(err);
  });
};

const paymentUpdate = (payment) => {
  PaymentRead.findByIdAndUpdate(payment._id, { $set: payment }, (err) => {
    if (err) console.error(err);
  });
};

const paymentDelete = (payment) => {
  PaymentRead.findByIdAndRemove(payment._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
  paymentCreate,
  paymentUpdate,
  paymentDelete,
};
