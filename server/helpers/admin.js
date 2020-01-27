import { User } from '../models/models';
import { hash } from 'bcryptjs';
require('dotenv').config()

const createAdmin = (username) => {
  User.find({username}).then((users) => {
    if (!users.length) {
      hash(process.env.ADMIN_PASS_1, 10, (err, hashed_code) => {
        const newUserEntry = {
          fullname: 'admin',
          email: 'admin@gmail.com',
          username: username,
          password: hashed_code,
          registered: new Date().toISOString(),
          isAdmin: true
        }
        User.create(newUserEntry).then(() => {
          console.log(`${username} created`)
        })
      });
    }
  })
}

export default function initializeAdmins(){
  createAdmin('admin1')
  createAdmin('admin2')
}
