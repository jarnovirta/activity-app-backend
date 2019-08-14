import { Document, Model, model, Schema } from "mongoose"
import IStravaToken from "./../interfaces/IStravaToken"
import IUser from "./../interfaces/IUser"

export interface IUserDocument extends Document {
  firstName: string,
  lastName: string,
  passwordHash?: string,
  stravaToken: IStravaToken,
  username: string
}

interface IUserModel extends Model<IUserDocument> {
  format(user: IUserDocument): IUser
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  stravaToken: { type: Object, required: false },
  username: { type: String, required: true, unique: true }
})

UserSchema.statics.format = (user: IUserDocument) => {
  return {
    firstName: user.firstName,
    id: user._id,
    lastName: user.lastName,
    stravaToken: { ...user.stravaToken, refreshToken: "" },
    username: user.username
  }
}
export default model<IUserDocument>("User", UserSchema) as IUserModel
