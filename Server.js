import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectDb } from './Database/ConnectDB.js';
import UserRouter from './Routes/UserRoute.js';
import MovieRouter from './Routes/MovieRoute.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connecting to database
ConnectDb();  // This will now correctly call the ConnectDb function

app.use(cookieParser());

// CORS configuration to allow specific origins (no wildcard when credentials are used)
const allowedOrigins = ['http://localhost:3000', 'http://18.212.30.69:5001']; // Replace with your frontend domains
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions)); // Use CORS middleware
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// File upload handling with multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.use('/user', UserRouter);
app.use('/movie', MovieRouter);

// In production mode, serve the React app's build files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // In development, assume the frontend is being served by a separate development server
  app.get('/', (req, res) => {
    res.send('<h1>Backend is running</h1>');
  });
}

// Listening on the port specified in the environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
