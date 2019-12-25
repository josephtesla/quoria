import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Cors from 'cors';
import logger from 'morgan';
import AuthRouter from "./routes/auth.route";
import ParcelRouter from './routes/parcels.route';
import verifyToken from './middleware/verifytoken'
import initConnection from './helpers/init';


config(); //load .env file into current process
initConnection(); //setup database connection

const API_V1 = '/api/v1';
const app = express();

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//ENABLE CORS
app.use(Cors());

app.use(logger('dev'));

//SIGN IN AND LOGIN ENDPOINTS
app.post(`${API_V1}/auth/signup`, AuthRouter.register);

app.post(`${API_V1}/auth/login`, AuthRouter.login);

//middleware to secure routes with jwt authentication
app.use('*', verifyToken);

//API ENDPOINTS
app.get(`${API_V1}/parcels`, ParcelRouter.getParcels);

app.get(`${API_V1}/parcels/:parcelId`, ParcelRouter.getSingleParcel)

app.get(`${API_V1}/users/:userId/parcels`, ParcelRouter.getParcelsByUser)

app.patch(`${API_V1}/parcels/:parcelId/cancel`, ParcelRouter.cancelParcelOrder)

app.post(`${API_V1}/parcels/:userId`, ParcelRouter.createParcelOrder)

app.patch(`${API_V1}/parcels/:parcelId/:userId/destination`, ParcelRouter.changeParcelDestination)

app.patch(`${API_V1}/parcels/:parcelId/:userId/status`, ParcelRouter.changeParcelStatus)

app.patch(`${API_V1}/parcels/:parcelId/:userId/currentlocation`, ParcelRouter.changeParcelCurrentLocation)


// // catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handlers
// // development error handler
// // will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// // production error handler
// // no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



export default app;