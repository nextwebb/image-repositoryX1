import { Request, Response } from "express";
import { NotFound, BadRequest } from "http-errors";
import createError from "http-errors";

import { User } from "../../../database";
import { signAccessToken, isPasswordValid } from "../../../utils/jwt";

const SignIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email },
      {
        __v: 0,
      }
    );

    if (!user) {
      throw new NotFound("user not found!");
    }

    const checkPassword = isPasswordValid(user.password, password);
    if (!checkPassword) {
      throw new BadRequest(
        "Auth Failed, please check that your login details are correct"
      );
    }
    user.password = undefined;

    const token = await signAccessToken({ id: user._id }).catch((err) => {
      new createError.InternalServerError(err.message);
    });

    return res.status(200).json({
      message: "user log in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message || "bad request",
    });
  }
};

export default SignIn;
