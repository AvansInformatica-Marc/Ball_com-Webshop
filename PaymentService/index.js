const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

// eslint-disable-next-line no-multi-assign
const app = (module.exports = express());
const port = 8080;

require('./utils/database.utils');
require('./utils/MQEventListener.utils');

app.use(bodyParser.json({ extended: true }));

app.use('/payment', routes);

// Listen on port
app.listen(port, () => {
  console.info(`Started Express on port ${port}`);
});
