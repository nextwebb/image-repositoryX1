import express from "express";
import multer from "multer";

const upload = multer({});

import { AddImages } from "./handlers";
import { addImagePayload } from "../../utils/joi";
import { mustBeLoggedIn, validator } from "../../middlewares";

const router = express.Router();

router.post(
  "/repository",
  mustBeLoggedIn,
  validator(addImagePayload),
  upload.array("images", 100),
  AddImages
);

export default router;
