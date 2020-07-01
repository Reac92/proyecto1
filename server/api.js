const express = require('express');
const apiRouter = express.Router();
const minionsRouter = require('./api/minions');
const ideasRouter = require('./api/ideas');
const meetingsRouter = require('./api/meetings');

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;


