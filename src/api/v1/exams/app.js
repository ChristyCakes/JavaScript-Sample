import express from 'express';

import idGet from './:id/index.get';
import indexGet from './index.get';

const app = express();
app.get('/', indexGet);
app.get('/:id', idGet);

export default app;

