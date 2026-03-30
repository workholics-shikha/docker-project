const express = require('express');

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ ADD

const app = express();

// ✅ ADD THIS
app.use(cors({
    origin: 'http://localhost:3000'
}));

dotenv.config();

app.use(express.json()); // important

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // app.listen(PORT, () => {
        //     console.log(`Server running on port ${PORT}`);
        // });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();
