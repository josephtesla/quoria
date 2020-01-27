import mongoose, { mongo } from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  username: String,
  password: String,
  registered: Date,
  isAdmin: Boolean
})

const User = mongoose.model('User', userSchema)

const parcelSchema = new mongoose.Schema({
  placedBy: String, //sender's ID
  weight: String,
  weightmetric: String,
  sentOn: Date,
  deliveredOn: Date,
  status: String,
  from: String,
  to: String,
  currentLocation: String 
})

const Parcel = mongoose.model('Parcel', parcelSchema)

export { User, Parcel }