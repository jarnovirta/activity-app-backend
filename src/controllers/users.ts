import express, { Router, Request, Response } from 'express'
const router: Router = express.Router()
import bcrypt from 'bcrypt'
import { TNewUser, IUser } from '../types/user'
import UserModel, { IUserDocument } from './../models/user'

router.get('/', async (req: Request, res: Response) => {
  try {
    const users: Array<IUserDocument> = await UserModel.find({})
    const formatedUsers: Array<IUser> = users.map(user => user.format())
    res.json(formatedUsers)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went wrong...' })
  }
})
router.post('/', async (req: Request, res: Response) => {
  try {
    const saltRounds: number = 10
    const passwordHash: string = await bcrypt.hash(req.body.password, saltRounds)
    const user: TNewUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordHash,
      username: req.body.username
    }
    const mongoUser: IUserDocument = new UserModel(user)
    const savedUser: IUserDocument = await mongoUser.save()    
    res.status(201).json(savedUser.format())
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went wrong...' })
  }
})

export default router
