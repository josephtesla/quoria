
import { User } from "../models/models";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Config from '../helpers/config'


class AuthRouter {

  static register(req, res) {
    User.find({ username: req.body.username }).then(
      users => {
        if (users.length) return res.status(409).json({ status: 409, error: "You've already registered, kindly login" })
        bcrypt.hash(req.body.password, 10, (err, hashedCode) => {
          if (err) throw new Error(err.message)
          const newUserEntry = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            othernames: req.body.othernames,
            email: req.body.email,
            username: req.body.username,
            password: hashedCode,
            registered: new Date().toISOString(),
            isAdmin: false
          }
          User.create(newUserEntry).then(
            data => {
              const token = jwt.sign({id: data.id}, Config(process.env.NODE_ENV).KEY, { expiresIn: 86400 });
              User.findOne({username: data.username}, {password: 0}).then(
                user => {
                  return res.status(201).json({
                    status: 201,
                    data: [{ token, user: user }]
                  })
                }
              )
            }
          ).catch((err) => setImmediate(() => {
            res.status(500).json({status: 500, error:"Error while registering user"});
          }))
        })
      }
    )
  }


  static login(req, res){
    const { username, password } = req.body;
    User.find({username: username}).then(
      data => {
        if (data.length === 0) {
          return res.status(404).json({status: 404, error:"Username doesn't exist!"})
        }
        bcrypt.compare(password, data[0].password).then((matched) => {
          if (!matched) return res.status(404).json({status: 404, error:"Username or password incorrect"})

          const token = jwt.sign({id: data[0].id}, Config(process.env.NODE_ENV).KEY, { expiresIn: 86400 });
          User.findOne({username: username}, {password: 0}).then(
            user => {
              return res.status(200).json({
                status: 200,
                data: [{ token, user: user }]
              })
            }
          )
        })
      }
    ).catch(() => setImmediate(() => {
      res.status(500).json({status: 500, error:"Error while Logging in user"})
    }))
  }
}


export default AuthRouter;