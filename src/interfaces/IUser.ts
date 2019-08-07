export default interface IUser {
  name: string,
  username: string,
  passwordHash?: string,
  stravaAccessToken?: string,
  stravaRefreshToken?: string
}
