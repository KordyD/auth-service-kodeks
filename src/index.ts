import { config } from 'dotenv';
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config();
}
import express from 'express';
import mountRoutes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
mountRoutes(app);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
