import express from 'express'
import { Op } from 'sequelize'

import User, { Serialize } from '../Models/user.model.js'

import { ErrorResponse, SuccessResponse } from '../Utils/Response.util.js'
import { RegexEmail, RegexOneWord } from '../Utils/Regexes.util.js'
import { Capitalize } from '../Utils/Strings.util.js'
import { GeneratePasswordHash } from '../Utils/Passwords.util.js'
import { VerifyAccessToken } from '../Utils/Tokens.util.js'

const UserRoute       = express()

UserRoute.get('/', VerifyAccessToken, async (req, res) => {
  const allUsers          = await User.find()

  return SuccessResponse(200, 'users', 'Found all users successfully.', { users: allUsers }, res)
})

UserRoute.post('/', async (req, res) => {
  let email                 = req.body.email
  let username              = req.body.username
  let firstname             = req.body.firstname
  let surname               = req.body.surname
  let password              = req.body.password
  let confirm               = req.body.confirmPassword

  if(!email) return ErrorResponse(422, 'email', 'You need to enter an e-mail.', null, res)
  else if(!RegexEmail(email)) return ErrorResponse(400, 'email', 'Enter a valid e-mail.', null, res)

  if(!username) return ErrorResponse(422, 'username', 'You need to enter a username', null, res)
  else if(!RegexOneWord(username)) return ErrorResponse(400, 'username', 'Username can only be one word.', null, res)

  if(!password) return ErrorResponse(422, 'password', 'You need to enter a password.', null, res)
  else if(!confirm) return ErrorResponse(422, 'confirmPassword', 'You need to confirm your password.', null, res)
  else if(password !== confirm) return ErrorResponse(403, 'confirmPassword', 'Passwords doesn\'t match.', null, res)

  email                           = email.toLowerCase()
  username                        = Capitalize(username)
  firstname                       = firstname ? Capitalize(firstname) : null
  surname                         = surname ? Capitalize(surname) : null

  try {
    const findExistingEmail       = await User.findOne({ email: email })
    const findExistingUsername    = await User.findOne({ username: username })

    if(findExistingEmail) return ErrorResponse(409, 'email', 'User with the provided e-mail already exists.', Serialize(findExistingEmail), res)
    else if(findExistingUsername) return ErrorResponse(409, 'username', 'User with the provided username already exists.', Serialize(findExistingUsername), res)

    return GeneratePasswordHash(password)
      .then(async (hash) => {
        const newUser       = new User({
          email             : email,
          username          : username,
          firstname         : firstname,
          surname           : surname,
          password          : hash,
        })

        await newUser.save()

        return SuccessResponse(200, 'user', 'You\'ve successfully signed up.', { user: Serialize(newUser) }, res)
      })
      .catch((error) => {
        return ErrorResponse(500, 'password', 'Something went wrong with encrypting your password.', { errorData: error.message }, res)
      })
  } catch(error) {
    return ErrorResponse(500, 'user add', 'Something went wrong with submitting new user.', { errorData: error.message }, res)
  }
})

export default UserRoute