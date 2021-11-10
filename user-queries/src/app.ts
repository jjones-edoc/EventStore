import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@edoccoding/common';

import { randomUser } from './routes/randomuser';
import { getUsersRouter } from './routes/getusers';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use(randomUser);
app.use(getUsersRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
