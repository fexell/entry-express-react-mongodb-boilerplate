import mongoose from 'mongoose'

const UserSchema              = new mongoose.Schema({
  email                     : { type: String, required: true, unique: true },
  username                  : { type: String, required: true, unique: true },
  firstname                 : { type: String },
  surname                   : { type: String },
  active                    : { type: Boolean, default: true },
  lastLoggedInAt            : { type: Date },
  password                  : { type: String, required: true, },
  passwordRecoveryToken     : { type: String, default: null },
  ipAddresses               : { type: Array },
  createdAt                 : { type: Date, default: Date.now() },
  updatedAt                 : { type: Date, default: Date.now() }
})

const User                    = mongoose.model('User', UserSchema)

export const Serialize        = ({
  _id,
  email,
  username,
  firstname,
  surname,
  active,
  lastLoggedInAt,
  createdAt,
  updatedAt,
}) => {
  return {
    _id               : _id,
    email             : email,
    username          : username,
    firstname         : firstname,
    surname           : surname,
    active            : active,
    lastLoggedInAt    : lastLoggedInAt,
    createdAt         : createdAt,
    updatedAt         : updatedAt,
  }
}

export default User