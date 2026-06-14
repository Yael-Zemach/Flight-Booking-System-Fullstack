import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http'; // 🌟 חדש: ייבוא ספריית ה-HTTP המובנית של Node
import { Server } from 'socket.io';  // 🌟 חדש: ייבוא מחלקת השרת של Socket.io
import { API_ROUTES } from './constants/apiRoutes.js';
import { MESSAGES } from './constants/messages.js';
import { checkAndCleanExpiredBookings } from './services/bookingsService.js';
import flightsRouter from './routes/flightsRoute.js';
import authRouter from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js'; 
import bookingsRoutes from './routes/bookingRoutes.js';
import airportsRoutes from './routes/airportsRoutes.js';


const app = express();
const baseUrl = API_ROUTES.BASE;
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // 🌟 ודאי שזהו הפורט שבו הריאקט שלך רץ!
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 משתמש התחבר ל-WebSocket! מזהה ייחודי: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ משתמש התנתק מהסוקט: ${socket.id}`);
    });
});

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(`${baseUrl}/flights`, flightsRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/users`, usersRoutes); 
app.use(`${baseUrl}/bookings`, bookingsRoutes); 
app.use(`${baseUrl}/airports`, airportsRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} with WebSockets enabled!`);

  setInterval(() => {
      checkAndCleanExpiredBookings();
  }, 15 * 60 * 1000);
});