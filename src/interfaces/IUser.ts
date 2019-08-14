import StravaToken from "./IStravaToken";

export default interface IUser {
  firstName: string,
  id?: number,
  lastName: string,
  loginToken?: string,
  username: string,
  passwordHash?: string,
  stravaToken?: StravaToken
}
