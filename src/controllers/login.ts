import express from "express"
const router = express.Router()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import IUser from "./../interfaces/IUser"

import User, { IUserDocument } from "./../models/user"

router.post("/", async (request, response) => {
  console.log("Logging in user")
  console.log(request.body)

  try {
    const existingUser: IUserDocument = await User.findOne({ username: request.body.username })

    let validPasswordHash
    if (existingUser) { validPasswordHash = existingUser.passwordHash }
    const user: IUser = existingUser ? User.format(existingUser) : null

    const correctCreds = user === null ?
      false :
      await bcrypt.compare(request.body.password, validPasswordHash)

    if (!(correctCreds)) {
      return response.status(401).json({ error: "invalid username or password" })
    }

    const tokenUser = {
      id: user.id,
      username: user.username
    }

    user.loginToken = jwt.sign(tokenUser, process.env.SECRET)
    response.status(200).send(user)
  } catch (e) {
    console.log(e)
    response.status(500).json({ error: "something went wrong..." })
  }
})

export default router
