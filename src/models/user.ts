import { Document, Model, model, Schema } from "mongoose"
import IUser from "./../interfaces/IUser"

interface IUserDocument extends Document {
  name: string,
  passwordHash: string,
  stravaAccessToken: string,
  stravaRefreshToken: string,
  username: string
}

interface IUserModel extends Model<IUserDocument> {
  format(user: IUserDocument): IUser
}
// TODO: validation
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  stravaAccessToken: { type: String, required: false },
  stravaRefreshToken: { type: String, required: false },
  username: { type: String, required: true, unique: true }
})

UserSchema.statics.format = (user: IUserDocument) => {
  return {
    id: user._id,
    name: user.name,
    stravaAccessToken: user.stravaAccessToken,
    username: user.username
  }
}
export default model<IUserDocument>("User", UserSchema) as IUserModel
