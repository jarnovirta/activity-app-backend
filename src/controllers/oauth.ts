import express from "express"
const router = express.Router()

router.get("/authCode/:userId", (request, response) => {
  const code = request.query.code
  console.log("user id: ", request.params.userId)
  console.log("code: ", code);
  const devFrontServer = process.env.DEV_FRONT_SERVER_URL
  const redirectUrl = devFrontServer ? devFrontServer : "/"
  console.log("Received Strava token!!")
  response.redirect(redirectUrl)
})
router.get("/redirectUrl", (request, response) => {
  console.log("Got request for redirectUrl")
  const MOCK_USER_ID = 1234567
  const url = `${process.env.SERVER_URL}:${process.env.PORT}`
    + `/api/oauth/authCode/${MOCK_USER_ID}`
  console.log("redirectUrl", url)
  response.send(url)
})
export default router
