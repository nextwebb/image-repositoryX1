import type { Server } from "http";
import { User, Repository } from "../../database";

import app from "../../app";
import { Permissions } from "../../types";

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const BASE_URL = "/api/v1/images";
const TEST_DATA = {
  users: [
    {
      _d: "13daddf6-cff8-4290-91a3-535620a2e4c6",
      username: "Berge",
      email: "sandy@hey.com",
      password: "password",
    },
    {
      _id: "304861fb-0247-4199-b116-41a944e0283e",
      username: "Dalton",
      email: "tedd@hey.com",
      password: "password",
    },
  ],
  images: [
    {
      id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
      url: "https://image-repository-s3-bucket.s3.us-east-2.amazonaws.com/images/Screenshot%20from%202020-08-14%2012-31-49.png-JDVzxuw3",
      permission: Permissions.PUBLIC,
      key: "images/Screenshot from 2020-08-14 12-31-49.png-JDVzxuw3",
      author: "13daddf6-cff8-4290-91a3-535620a2e4c6",
    },
    {
      id: "0e6c8b1b-50b7-403f-b01e-47961743dc59",
      url: "https://image-repository-s3-bucket.s3.us-east-2.amazonaws.com/images/Screenshot%20from%202020-08-14%2012-31-49.png-JDVzxuw3",
      permission: Permissions.PRIVATE,
      key: "images/Screenshot from 2020-08-14 12-31-49.png-JDVzxuw3",
      author: "13daddf6-cff8-4290-91a3-535620a2e4c6",
    },
  ],
};

describe("images", () => {
  let server: Server;
  let connection: any;

  beforeAll(async (done) => {
    connection = await mongoose.connect(
      "mongodb://localhost:27017/image-repository"
    );
    server = app.listen();

    for await (const user of TEST_DATA.users) {
      await User.create(user);
    }

    for await (const image of TEST_DATA.images) {
      await Repository.create(image);
    }

    done();
  });

  afterAll(async (done) => {
    server.close();

    // cleanup
    await User.deleteMany({});
    await Repository.deleteMany({});

    await connection.close();
    done();
  });
});
