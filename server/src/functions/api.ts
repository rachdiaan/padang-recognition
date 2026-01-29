import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import authRoutes from '../routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB (cached)
connectDB();

const router = Router();

router.get('/', (req, res) => {
    res.send('Padang Food Recognition API (Netlify)');
});

// Use routes
app.use('/.netlify/functions/api/auth', authRoutes); // Netlify path
app.use('/api/auth', authRoutes); // Local fallback

export const handler = serverless(app);
