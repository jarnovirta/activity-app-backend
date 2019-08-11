export default interface IUser {
  firstName: string,
  id?: number,
  lastName: string,
  loginToken?: string,
  username: string,
  passwordHash?: string,
  stravaAccessToken?: string,
  stravaRefreshToken?: string
}
