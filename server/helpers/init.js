import Config from './config'
import mongoose from 'mongoose'
require('dotenv').config()

export default function initConnection(){
  mongoose.connect(Config(process.env.NODE_ENV).DATABASE_URI, { useNewUrlParser: true });
  mongoose.connection.on('open', () => {
    console.log(Config(process.env.NODE_ENV).DATABASE_URI)
    console.log('Database successfully connected!')
  })
  mongoose.connection.on('error', () => {
    console.log('Error connecting to Database!')
  })
}
