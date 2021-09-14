import { Schema, model } from "mongoose";
import { Permissions } from "../types";

interface Respository {
  key: string;
  url: string;
  permission: Permissions;
  author: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Respository>({
  key: { type: String, required: true },
  url: { type: String, required: true },
  permission: {
    type: String,
    enum: Permissions,
    default: Permissions.PUBLIC,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const RespositoryModel = model<Respository>("Respository", schema);

export default RespositoryModel;
