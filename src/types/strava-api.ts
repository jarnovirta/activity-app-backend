
export interface IStravaUser {
  firstname: string,
  lastname: string,
  username: string
}
export interface IStravaTokenResponse {
  athlete: IStravaUser,
  access_token: string,
  expires_at: number,
  refresh_token: string
}
export default interface IStravaToken {
  accessToken: string,
  expiresAt: number,
  refreshToken: string,
}
