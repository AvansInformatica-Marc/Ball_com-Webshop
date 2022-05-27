const router = require('express').Router();
const orderCommandController = require('../controllers/orderCommand.controller');

// command
router.post('/dummy', orderCommandController.orderDummySetup);
router.post('/', orderCommandController.orderCreate);
router.put('/:id', orderCommandController.orderUpdate);
router.delete('/:id', orderCommandController.orderDelete);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
