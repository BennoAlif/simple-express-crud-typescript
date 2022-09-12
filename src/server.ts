import express, { Application, urlencoded, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(routes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

export default app;
