import { Document, Model, model, Schema } from 'mongoose'
import { IUser } from '../types/user'

export interface IUserDocument extends Pick<IUser, 
  Exclude<keyof IUser, keyof Document>>, Document {
  format: () => IUser
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  stravaToken: { type: Object, required: false },
  username: { type: String, required: true, unique: true }
})
UserSchema.method('format', function (): IUser {
  return {
    firstName: this.firstName,
    id: this._id,
    lastName: this.lastName,
    passwordHash: '',
    stravaToken: { ...this.stravaToken, refreshToken: '' },
    username: this.username
  } 
})

export const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema)

export default User