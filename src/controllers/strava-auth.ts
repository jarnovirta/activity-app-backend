import express, { Router, Request, Response } from 'express'
const router: Router = express.Router()
import axios from 'axios'
import { IUserDocument } from '../models/user'
import UserModel from '../models/user'
import IStravaToken, { IStravaTokenResponse, IStravaUser } from '../types/strava-api'

const stravaApiTokenUrl: string = 'https://www.strava.com/oauth/token'

interface IReqParams {
  userId: string
}
router.get('/authCode/:userId', async (req: Request, res: Response) => {  
  const code:string = req.query.code
  const id: string = (req.params as Partial<IReqParams>).userId
  const devFrontServerUrl: string = process.env.DEV_FRONT_SERVER_URL
  try {
    const response:IStravaTokenResponse = await getStravaTokens(code)
    const token: IStravaToken = {
      accessToken: response.access_token,
      expiresAt: response.expires_at,
      refreshToken: response.refresh_token
    }  
    await UserModel.updateOne({ _id: id }, {
      stravaToken: token
    })
  }
  catch (e) {
    console.log(e)
  }
  const redirectUrl: string = devFrontServerUrl ? devFrontServerUrl : '/'
  res.redirect(redirectUrl)
})

router.get('/redirectUrl', (req: Request, res: Response) => {
  const url: string = `${process.env.SERVER_URL}:${process.env.PORT}`
    + `/api/oauth/authCode`
  res.send(url)
})
router.post('/refreshToken', async (req: Request, res: Response) => {
  const user: IUserDocument = await UserModel.findById(req.body.userId)
  const token: IStravaToken = await refreshStravaTokens(user.stravaToken.refreshToken)
  await user.updateOne({
    stravaToken: token
  })
  res.status(200).json(user.stravaToken)
})

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
