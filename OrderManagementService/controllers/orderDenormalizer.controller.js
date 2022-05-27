/* eslint-disable no-underscore-dangle */
const OrderRead = require('../models/orderRead.model');

const orderCreate = (order) => {
  const orderNew = new OrderRead(order);

  orderNew.save((err) => {
    if (err) console.error(err);
  });
};

const orderUpdate = (order) => {
  OrderRead.findByIdAndUpdate(order._id, { $set: order }, (err) => {
    if (err) console.error(err);
  });
};

const orderDelete = (order) => {
  OrderRead.findByIdAndRemove(order._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
  orderCreate,
  orderUpdate,
  orderDelete,
};
