/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Supplier = require('../models/supplier.model');
const MQService = require('../utils/MQService.utils');

const orderDummySetup = (req, res) => {
  const dummyCustomer = new Customer({
    firstname: 'Customer',
    lastname: 'van customer',
    email: 'dummymail@dummy.com',
    adress: 'Dummy van dummylaan',
  });
  const dummySupplier = new Supplier({
    name: 'Dummy supplier',
  });
  dummySupplier.save().then((createdSupplier) => {
    const dummyProduct1 = new Product({
      name: 'Product 1',
      supplier: createdSupplier._id,
      price: 2,
      stock: 100,
    });
    dummyProduct1
      .save()
      .then((createdDummyProduct1) => {
        const dummyProduct2 = new Product({
          name: 'Product 2',
          supplier: createdSupplier._id,
          price: 3,
          stock: 200,
        });
        dummyProduct2
          .save()
          .then((createDummyProduct2) => {
            dummyCustomer
              .save()
              .then((createdDummyCustomer) => {
                res.status(201).json({
                  createdDummyProduct1: {
                    createdDummyProduct1,
                  },
                  createDummyProduct2: {
                    createDummyProduct2,
                  },
                  createdDummyCustomer: {
                    createdDummyCustomer,
                  },
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  message: 'Creating a dummy customer failed!',
                });
              });
          })
          .catch(() => {
            res.status(500).json({
              message: 'Creating a dummy product failed!',
            });
          });
      })
      .catch(() => {
        res.status(500).json({
          message: 'Creating a dummy product failed!',
        });
      });
  });
};

const orderCreate = (req, res, next) => {
  const newOrder = new Order({
    products: req.body.products,
    customer: req.body.customer,
    status: 'created',
  });

  Product.find()
    .distinct('_id')
    .then((distinctProductIds) => {
      let differentItemCount = 0;
      for (let i = 0; i < req.body.products.length; i++) {
        if (distinctProductIds.includes(req.body.products[i])) {
          differentItemCount++;
        }
      }
      if (differentItemCount <= 20) {
        newOrder.save(async (err) => {
          if (err) return next(err);
          await MQService.sendMessage(
            'notification',
            JSON.stringify({ eventType: 'createOrder', order: newOrder })
          );
          return res.status(200).json(newOrder).end();
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Creating order failed!',
      });
    });
};

const orderUpdate = async (req, res, next) => {
  Order.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'order',
      JSON.stringify({
        eventType: 'updateOrder',
        order: { _id: req.params.id, ...req.body },
      })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({
        eventType: 'updateOrder',
        order: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const orderDelete = (req, res, next) => {
  Order.findByIdAndRemove(req.params.id, async (err, order) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'order',
      JSON.stringify({ eventType: 'deleteOrder', order })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({ eventType: 'deleteOrder', order })
    );
    return res.status(200).json('Order removed.').end();
  });
};

module.exports = {
  orderDummySetup,
  orderCreate,
  orderUpdate,
  orderDelete,
};
