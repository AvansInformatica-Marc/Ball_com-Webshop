const PaymentRead = require('../models/paymentRead.model');

const paymentRead = (req, res, next) => {
    PaymentRead.findById(req.params.id, (err, payment) => {
    if (err) return next(err);
    return res.status(200).json(payment).end();
  });
};

const paymentGetAll = (req, res, next) => {
    PaymentRead.find((err, payments) => {
    if (err) return next(err);
    return res.status(200).json(payments).end();
  });
};

module.exports = {
    paymentRead,
    paymentGetAll,
};
