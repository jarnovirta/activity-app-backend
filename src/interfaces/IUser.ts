export default interface IUser {
  firstName: string,
  lastName: string,
  username: string,
  passwordHash?: string,
  stravaAccessToken?: string,
  stravaRefreshToken?: string
}
