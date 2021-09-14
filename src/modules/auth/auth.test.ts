import request from "supertest";
import app from "../../app";
import { User } from "../../database";
import * as utils from "../../utils/jwt";
import type { Server } from "http";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const BASE_URL = "/api/v1/auth";

describe("auth", () => {
  let server: Server;
  let connection: any;

  beforeAll(async (done) => {
    connection = await mongoose.connect(
      "mongodb://localhost:27017/image-repository"
    );
    server = app.listen();
    done();
  });

  afterAll(async (done) => {
    server.close();
    await connection.close();
    done();
  });

  it("should login user and return profile with auth token", async (done) => {
    const payload = {
      email: "sandy@hey.com",
      password: "password",
    };

    const hash = utils.hashPassword(payload.password);

    const expectedResponse = {
      _id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
      email: payload.email,
      password: hash,
    };

    const mockFindOne = jest.spyOn(User, "findOne").mockImplementation(() => {
      return Promise.resolve(
        expectedResponse as {
          _id: string;
          email: string;
          password: string;
        }
      );
    });

    return request(server)
      .post(`${BASE_URL}/login`)
      .send(payload)
      .expect(200)
      .expect((res) => {
        expect(mockFindOne).toHaveBeenCalled();
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("user log in successfully");
        expect(res.body).toHaveProperty("user");
        expect(res.body).toHaveProperty("token");
        done();
      });
  });

  it("should return an unauthorized error response if wrong password is provided", async (done) => {
    const payload = {
      email: "sandy@hey.com",
      password: "password",
    };

    const hash = utils.hashPassword("password123");

    const expectedResponse = {
      _id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
      email: payload.email,
      password: hash,
    };

    // create a mock implementaion of <repository.findOne>
    const mockFindOne = jest.spyOn(User, "findOne").mockImplementation(() => {
      return Promise.resolve(
        expectedResponse as {
          _id: string;
          email: string;
          password: string;
        }
      );
    });

    return request(server)
      .post(`${BASE_URL}/signin`)
      .send(payload)
      .expect(401)
      .expect((res) => {
        expect(mockFindOne).toHaveBeenCalled();
        expect(res).toBe(true);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(
          "Auth Failed, please check that your login details are correct"
        );
        done();
      });
  });

  it("should create user and return profile with auth token", async (done) => {
    const payload = {
      username: "Sander",
      email: "sander.b@hey.com",
      password: "password",
    };

    const { password, ...createdUser } = payload;

    const mockGenerateAuthToken = jest.spyOn(utils, "signAccessToken");
    const mockCreate = jest.spyOn(User, "create").mockImplementation(() => {
      return Promise.resolve({
        ...createdUser,
        id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
      } as unknown as {
        username: string;
        email: string;
        password: string;
      });
    });

    return request(server)
      .post(`${BASE_URL}/signup`)
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(mockGenerateAuthToken).toHaveBeenCalledWith("7d", {
          id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
          email: createdUser.email,
        });
        expect(mockCreate).toHaveBeenCalled();
        expect(res.ok).toBe(true);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("user account created successfully");
        expect(res.body).toHaveProperty("token");
        done();
      });
  });
});
