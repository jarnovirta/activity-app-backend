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
router.post('/', async (req, res) => {
  console.log('posting user')
  console.log(req.body)

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user: IUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordHash,
      username: req.body.username
    }
    const mongoUser = new User(user)
    const savedUser = await mongoUser.save()    
    res.status(201).json(User.format(savedUser))
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'something went wrong...' })
  }
})

export default router
