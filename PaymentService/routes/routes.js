const router = require('express').Router();
const paymentCommandController = require('../controllers/paymentCommand.controller');
const paymentQueryController = require('../controllers/paymentQuery.controller');

// command
router.post('/', paymentCommandController.paymentCreate);
router.put('/:id', paymentCommandController.paymentUpdate);
router.delete('/:id', paymentCommandController.paymentDelete);

// query
router.get('/:id', paymentQueryController.paymentRead);
router.get('/', paymentQueryController.paymentGetAll);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
