import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Cors from 'cors';
import logger from 'morgan';
import authRouter from "./routes/auth.route";
import parcelRouter from './routes/parcels.route';
import userRouter from './routes/user.route';
import UIRoute from '../index';
import verifyToken from './middleware/verifytoken'
import initConnection from './helpers/init';
import initializeAdmins from './helpers/admin';

initializeAdmins(); //setup admins
config(); //load .env file into current process
initConnection(); //setup database connection

const API_V1 = '/api/v1';
const app = express();

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", UIRoute);

//ENABLE CORS
app.use(Cors());

app.use(logger('dev'));

//SIGN IN AND LOGIN ENDPOINTS
app.use(`${API_V1}/auth`, authRouter(express.Router()))

//middleware to secure routes with jwt authentication
app.use('*', verifyToken);

//API ENDPOINTS (MVC)
app.use(`${API_V1}/parcels`, parcelRouter(express.Router()));

app.use(`${API_V1}/users`, userRouter(express.Router()));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
// // production error handler
// // no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });



export default app;