const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load environment
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: true, credentials: true }));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4001',
        'https://superadmin-admin-user-dashboard-fro.vercel.app',
        'https://blogs-dashboard-frontend.vercel.app',
        'https://staging.nypunyaaesthetics.com/',
        'https://staging.nypunyaaesthetics.com',
        'https://dashboard.nypunyaaesthetics.com',
        'https://young-zen-admin-frontend.vercel.app',
        'https://youngzen.in',
        'https://www.youngzen.in',
    ],
    credentials: true, // important to allow cookies
}));
// DB Connect
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const leadRoutes = require('./routes/leadRoutes');
const seoMetadataRoutes = require('./routes/seoMetadataRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/leads', leadRoutes);
app.use('/api/seo-metadata', seoMetadataRoutes);
app.use('/api/portfolio', portfolioRoutes);


// Start server
const PORT = process.env.PORT || 7010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
