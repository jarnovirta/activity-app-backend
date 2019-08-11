import { Document, Model, model, Schema } from "mongoose"
import IUser from "./../interfaces/IUser"

export interface IUserDocument extends Document {
  firstName: string,
  lastName: string,
  passwordHash?: string,
  stravaAccessToken: string,
  stravaRefreshToken: string,
  username: string
}

interface IUserModel extends Model<IUserDocument> {
  format(user: IUserDocument): IUser
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  stravaAccessToken: { type: String, required: false },
  stravaRefreshToken: { type: String, required: false },
  username: { type: String, required: true, unique: true }
})

UserSchema.statics.format = (user: IUserDocument) => {
  return {
    firstName: user.firstName,
    id: user._id,
    lastName: user.lastName,
    stravaAccessToken: user.stravaAccessToken,
    username: user.username
  }
}
export default model<IUserDocument>("User", UserSchema) as IUserModel
