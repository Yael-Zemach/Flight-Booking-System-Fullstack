import 'dotenv/config';
import cors from 'cors';
import express from 'express';


import flightsRouter from './routes/flightsRoute.js';
import authRouter from './routes/authRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/flights', flightsRouter);


app.use('/api/auth', authRouter);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});