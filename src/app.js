import path from 'path';
import express from 'express';
import {appLogger as logger} from './lib';

import api from './api/app';

const staticDir = path.join(__dirname, 'static');

const app = express();

// app.use('/static', express.static(staticDir));
app.use(express.static(staticDir));

app.use('/api', api);

app.get('/', (req, res)=> {
  // return res.sendFile(path.join(staticDir + '/index.html'));
  return res.sendFile(path.join(staticDir + '/static'));
})

app.listen(4000, (arg) => {
  logger.debug('App listening on port 4000');
});

export default app;

// Workers are meant to be run in their own processes to scale, but due to the
// database being in memory, run them in proc.

import ScoreEventWorker from './workers/score';
const scoreEventWorker = new ScoreEventWorker();
scoreEventWorker.start();

