import { Request, Response } from "express";
import createError from "http-errors";
import { InternalServerError, Conflict } from "http-errors";

import { User } from "../../../database";
import { hashPassword, signAccessToken } from "../../../utils/jwt";

const SignUp = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Conflict("user with this email address exist");
    }

    const user = await User.create({
      email,
      username,
      password: hashPassword(password),
    });

    const token = await signAccessToken({ id: user._id }).catch((err) => {
      new createError.InternalServerError(err.message);
    });

    if (!user) {
      throw new InternalServerError("internal server error");
    }

    return res.status(201).json({
      message: "user account created successfully",
      token,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message || "bad request",
    });
  }
};

export default SignUp;
