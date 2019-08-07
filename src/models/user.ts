import { Document, Model, model, Schema } from "mongoose"
import IUser from "./../interfaces/IUser"

interface IUserDocument extends Document {
  name: string,
  passwordHash: string,
  username: string
}

interface IUserModel extends Model<IUserDocument> {
  format(user: IUserDocument): IUser
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true, unique: true }
})

UserSchema.statics.format = (user: IUserDocument) => {
  return {
    id: user._id,
    name: user.name,
    username: user.username
  }
}
export default model<IUserDocument>("User", UserSchema) as IUserModel
