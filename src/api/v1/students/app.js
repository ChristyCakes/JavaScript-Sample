import express from 'express';

import indexGet from './index.get';
import idGet from './:id/index.get';

const app = express();
app.get('/:id', idGet);
app.get('/', indexGet);

export default app;
