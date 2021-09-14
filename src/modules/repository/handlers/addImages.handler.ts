import { Request, Response } from "express";
import util from "util";
import { NotFound, InternalServerError, BadRequest } from "http-errors";
import { nanoid } from "nanoid";
import * as Aws from "aws-sdk";
import { AsyncUpload, Permissions } from "../../../types";

import { Repository } from "../../../database";

const instance = new Aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const asyncUpload: AsyncUpload = util.promisify(instance.upload).bind(instance);

const AddImages = async (req: Request, res: Response) => {
  try {
    const { permission } = req.body as {
      permission: Permissions;
    };
    const files = <Express.Multer.File[]>req.files;

    if (files.length < 1) {
      throw new BadRequest("No files found");
    }

    const uploadPromise = (file: Express.Multer.File) =>
      asyncUpload({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: file.buffer,
        Key: `images/${file.originalname}-${nanoid(8)}`,
        ContentType: file.mimetype,
      });

    const response = await Promise.all(
      files.map((file) => uploadPromise(file))
    );
    const { user } = res.locals;

    const uploadResult = response.map((el) => ({
      key: el.Key,
      url: el.Location,
      author: user.id,
      permission,
    }));

    const images = await Repository.insertMany({
      data: uploadResult,
    });

    res.status(201).json({
      ok: true,
      message: "files uploaded",
      data: {
        images,
      },
    });

    return res.status(200).json({
      message: "images uploaded successfully",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message || "bad request",
    });
  }
};

export default AddImages;
