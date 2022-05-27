const OrderRead = require('../models/orderRead.model');

const orderRead = (req, res, next) => {
  OrderRead.findById(req.params.id, (err, order) => {
    if (err) return next(err);
    return res.status(200).json(order).end();
  });
};

const orderReadAll = (req, res, next) => {
  OrderRead.find((err, orders) => {
    if (err) return next(err);
    return res.status(200).json(orders).end();
  });
};

module.exports = {
  orderRead,
  orderReadAll,
};
