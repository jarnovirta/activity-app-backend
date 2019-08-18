import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import IUser from './../interfaces/IUser';
import User from './../models/user'

router.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    const formatedUsers = users.map(User.format)
    response.json(formatedUsers)
  } catch (e) {
    console.log(e)
    response.status(500).json({ error: 'Something went wrong...' })
  }
})
router.post('/', async (request, response) => {
  console.log('posting user')
  console.log(request.body)

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)
    const user: IUser = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      passwordHash,
      username: request.body.username
    }
    const mongoUser = new User(user)
    const savedUser = await mongoUser.save()
    response.status(201).json(User.format(savedUser))
  } catch (e) {
    console.log(e)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

export default router
