import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['threads-frontend-c23ochsc9-dhusyanths-projects.vercel.app',
        'threads-frontend-five.vercel.app',
        'threads-frontend-c23ochsc9-dhusyanths-projects.vercel.app'
    ],
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

// ✅ Fix: Serve frontend from 'dist' instead of 'build'
const frontendPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendPath));

// ✅ Fix: Return 'index.html' from 'dist' for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
