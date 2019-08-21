import IStravaToken from './strava-api'

interface IBaseUser {
  firstName: string,
  lastName: string,
  passwordHash: string,
  username: string,  
}
export type TNewUser = IBaseUser


export interface IUser extends IBaseUser {
  id: string,
  stravaToken: IStravaToken
}

