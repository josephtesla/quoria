import jwt from 'jsonwebtoken';
import Config from '../helpers/config'

export default function verifyToken(req, res, next) {

  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    //verify secret and checks token
    jwt.verify(token, Config(process.env.NODE_ENV).KEY, (err, decodedToken) => {
      if (err){
        return res.status(401).json({error:"Failed to authenticate token!", status: 401})
      }
      // if everything is Good, save request for use in other routes
      req.decodedToken = decodedToken;
      next(); 
    });
  }
  else {
    res.status(403).json({status: 403, error:"Auth failed!. No token provided"})
  }

}