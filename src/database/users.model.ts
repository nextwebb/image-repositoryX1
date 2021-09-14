import { Schema, model } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true,
  },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const UserModel = model<User>("User", schema);

export default UserModel;
