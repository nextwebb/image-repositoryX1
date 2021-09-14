import express from "express";
import { SignUp, SignIn } from "./handlers";
import { signUpPayload, signInPayload } from "../../utils/joi";

import { validator } from "../../middlewares";

const router = express.Router();

router.post("/auth/signup", validator(signUpPayload), SignUp);
router.post("/auth/signin", validator(signInPayload), SignIn);

export default router;
