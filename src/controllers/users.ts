import express from "express"
const router = express.Router()
import User from "./../models/user"

router.get("/", async (request, response) => {
  try {
    const users = await User.find({})
    const formatedUsers = users.map(User.format)
    response.json(formatedUsers)
  } catch (e) {
    console.log(e)
    response.status(500).json({ error: "Something went wrong..." })
  }
})
router.post("/", async (request, response) => {
  console.log("posting user")
  console.log(request.body)
  try {
      let user = new User(request.body)
      user = await user.save()
      response.status(201).json(User.format(user))
    } catch (e) {
      console.log(e)
      response.status(500).json({ error: "something went wrong..." })
    }
})

export default router
