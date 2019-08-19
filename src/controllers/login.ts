import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import IUser from './../interfaces/IUser'

import User, { IUserDocument } from './../models/user'

router.post('/', async (req, res) => {
  console.log('Logging in user')
  console.log(req.session)
  try {
    const existingUser: IUserDocument = await User.findOne({ username: req.body.username })
    let validPasswordHash
    if (existingUser) { validPasswordHash = existingUser.passwordHash }
    const user: IUser = existingUser ? User.format(existingUser) : null
    const correctCreds = user === null ?
      false :
      await bcrypt.compare(req.body.password, validPasswordHash)

    if (!(correctCreds)) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
    req.session.userId = user.id
    res.status(200).json(user)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'something went wrong...' })
  }
})
router.get('/currentUser', async (req, res) => {
  if (req.session.userId) {
    const loggedInUser: IUserDocument = await User.findOne({
      _id: req.session.userId
    })
    res.status(200).json(User.format(loggedInUser))
    return
  }
  res.status(401).json({ message: 'User not logged in' })
})
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return console.log(err);
      }
  })
  res.sendStatus(200)
})
export default router
