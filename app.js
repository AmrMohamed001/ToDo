const express = require('express');
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');
const globalHandling = require('./controller/errorController');
const appError = require('./utils/appError');
const app = express();
////////////////////////////////////////////////////////////////////
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
////////////////////////////////////////////////////////////////////
app.use(express.json()); // bodyParser
////////////////////////////////////////////////////////////////////
//Mounting
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tasks', taskRoute);
app.all('*', (req, res, next) =>
  next(new appError('this route is not defined', 404))
);
app.use(globalHandling); // Global error handling middleware
///////////////////////////////////////////////////////////////////
module.exports = app;
