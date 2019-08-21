import express, { Router, Request, Response } from 'express'
const router: Router = express.Router()
import bcrypt from 'bcrypt'
import { IUser } from '../types/user'

import IUserModel, { IUserDocument } from './../models/user'

router.post('/', async (req: Request, res: Response) => {
  try {    
    const existingUser: IUserDocument = await IUserModel.findOne({ username: req.body.username })

    let validPasswordHash: string
    if (existingUser) { 
      validPasswordHash = existingUser.passwordHash 
    }
    const user: IUser = existingUser ? existingUser.format() : null
    const isCorrectCreds: boolean = user === null ? false 
      : await bcrypt.compare(req.body.password, validPasswordHash)

    if (!(isCorrectCreds)) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
    req.session.userId = user.id
    res.status(200).json(user)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'something went wrong...' })
  }
})
router.get('/currentUser', async (req: Request, res: Response) => {
  if (req.session.userId) {
    const loggedInUser: IUserDocument = await IUserModel.findOne({
      _id: req.session.userId
    })
    res.status(200).json(loggedInUser.format())
    return
  }
  res.status(401).json({ message: 'User not logged in' })
})
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
      if (err) {
          return console.log(err);
      }
  })
  res.sendStatus(200)
})
export default router
