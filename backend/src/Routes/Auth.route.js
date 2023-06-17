import express from 'express'
import { Sequelize } from 'sequelize'

import User, { Serialize } from '../Models/user.model.js'

import {
  ErrorResponse,
  SuccessResponse
} from '../Utils/Response.util.js'
import { RegexEmail } from '../Utils/Regexes.util.js'
import { VerifyPassword } from '../Utils/Passwords.util.js'
import {
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken
} from '../Utils/Tokens.util.js'

const AuthRoute                 = express()

AuthRoute.post('/login', async (req, res) => {
  let email                     = req.body.email
  let password                  = req.body.password

  email                         = email.toLowerCase()

  if(!email) return ErrorResponse(403, 'email', 'You need to enter your email.', null, res)
  else if(!RegexEmail(email)) return ErrorResponse(403, 'email', 'You need to enter a valid email.', null, res)

  if(!password) return ErrorResponse(403, 'password', 'You need to enter your password.', null, res)

  try {
    let user                    = await User.findOne({ email: email }).exec()
    
    if(!user) return ErrorResponse(404, 'password', 'Couldn\'t find a user with provided email.', null, res)
    else if(!user.active) return ErrorResponse(403, 'password', 'Your account is inactive.', null, res)

    VerifyPassword(password, user.password)
      .then(async (isValid) => {
        if(!isValid) return ErrorResponse(403, 'password', 'You\'ve entered the wrong password.', null, res)
        else {
          const accessToken     = SignAccessToken(Serialize(user))
          const refreshToken    = SignRefreshToken(Serialize(user))
          const ipAddress       = user.ipAddresses.filter((address) => address === req.socket.remoteAddress)

          if(!ipAddress) user.ipAddresses.push(req.socket.remoteAddress)

          user.lastLoggedInAt   = Date.now()

          await user.save()

          res.cookie('accessToken', accessToken, { maxAge: 604800 })
          res.cookie('refreshToken', refreshToken, { maxAge: 1209600 })

          return SuccessResponse(200, 'login', 'You\'ve logged in successfully.', {
            user            : Serialize(user),
            accessToken     : accessToken,
            refreshToken    : refreshToken
          }, res)
        }
      })
  } catch(error) {
    return ErrorResponse(500, 'login', 'Something went wrong with logging you in.', { errorData: error.message }, res)
  }
})

AuthRoute.put('/refresh', VerifyRefreshToken, (req, res) => {
  try {
    const accessToken           = SignAccessToken(Serialize(req.user))

    return SuccessResponse(200, 'refresh', 'User and access token has been refreshed.', {
      user          : Serialize(req.user),
      accessToken   : accessToken
    }, res)
  } catch(error) {
    return ErrorResponse(500, 'refresh', 'Something went wrong with refreshing user and access token.', null, res)
  }
})

export default AuthRoute