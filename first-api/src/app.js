const express = require('express');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
