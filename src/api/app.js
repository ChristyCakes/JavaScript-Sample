import express from 'express';
import v1 from './v1/app';

const app = express();

app.use('/v1', v1);

export default app;

