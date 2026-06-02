import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { API_ROUTES } from './constants/apiRoutes.js';
import { MESSAGES } from './constants/messages.js';

import flightsRouter from './routes/flightsRoute.js';
import authRouter from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js'; // הייבוא של הראוטר החדש
import bookingsRoutes from './routes/bookingsRoutes.js';
const app = express();
const baseUrl = API_ROUTES.BASE;
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use(`${baseUrl}/flights`, flightsRouter);


app.use(`${baseUrl}/auth`, authRouter);

app.use(`${baseUrl}/users`, usersRoutes); // השרת מבין שכל מה שמתחיל ב- `/api/users` הולך לקובץ הראוטר
app.use(`${baseUrl}/bookings`, bookingsRoutes); // השרת מבין שכל מה שמתחיל ב- `/api/bookings` הולך לקובץ הראוטר

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});