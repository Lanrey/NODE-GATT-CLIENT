import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { logger } from './helper';
import cronJob from './helper/cron';

const PORT = Number(process.env.PORT) || 5000;
const app = express();

// run cron job
cronJob.createRecords();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(500).send('server error, this will be resolved shortly!');

  next();
});

app.get('/', (request, response) => {
  response.status(200).send('Welcome to Wellness Backend');
});

app.use('/api/v1', routes);

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

export default app;
