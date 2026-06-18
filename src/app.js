const express = require('express');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(requestLogger);         
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);      

module.exports = app;
