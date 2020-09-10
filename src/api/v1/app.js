import express from 'express';
import students from './students/app';
import exams from './exams/app';

const app = express();

app.use('/students', students);
app.use('/exams', exams);

export default app;
