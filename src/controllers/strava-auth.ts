import express from 'express'
const router = express.Router()
import axios from 'axios'
import IUser from '../interfaces/IUser'
import { IUserDocument } from '../models/user'
import UserModel from '../models/user'
import IStravaToken from './../interfaces/IStravaToken';

const stravaApiTokenUrl = 'https://www.strava.com/oauth/token'

interface IReqParams {
  userId: string
}
router.get('/authCode/:userId', async (req, res) => {  
  const code = req.query.code
  const id: string = (req.params as Partial<IReqParams>).userId
  const devFrontServer = process.env.DEV_FRONT_SERVER_URL
  try {
    const tokens = await getStravaTokens(code)
    const stravaUser: IUser = getUser(tokens)  
    await UserModel.updateOne({ _id: id }, {
      stravaToken: stravaUser.stravaToken
    })
  }
  catch (e) {
    console.log(e)
  }
  const redirectUrl = devFrontServer ? devFrontServer : '/'
  res.redirect(redirectUrl)
})

router.get('/redirectUrl', (request, response) => {
  const url = `${process.env.SERVER_URL}:${process.env.PORT}`
    + `/api/oauth/authCode`
  response.send(url)
})
router.post('/refreshToken', async (request, response) => {
  const user: IUserDocument = await UserModel.findById(request.body.userId)
  const token: IStravaToken = await refreshStravaTokens(user.stravaToken.refreshToken)
  await user.updateOne({
    stravaToken: token
  })
  response.status(200).json(user.stravaToken)
})

const getUser = (stravaTokenResponse: any): IUser => {
  return {
    firstName: stravaTokenResponse.athlete.firstname,
    lastName: stravaTokenResponse.athlete.lastname,
    stravaToken: {
      accessToken: stravaTokenResponse.access_token,
      expiresAt: stravaTokenResponse.expires_at,
      refreshToken: stravaTokenResponse.refresh_token
    },
    username: stravaTokenResponse.athlete.username
  }
}
const getStravaTokens = async (code: string): Promise<any> => {
  const params = {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code'
  }
  const response = await axios.post(stravaApiTokenUrl, params)
  return response.data
}
const refreshStravaTokens = async (refreshToken: string): Promise<IStravaToken> => {
  const params = {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }
  const response = await axios.post(stravaApiTokenUrl, params)
  const token = {
    accessToken: response.data.access_token,
    expiresAt: response.data.expires_at,
    refreshToken: response.data.refresh_token
  }
  return token
}

export default router
