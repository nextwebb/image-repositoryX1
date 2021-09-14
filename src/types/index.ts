import type Aws from "aws-sdk";

export enum Permissions {
  PUBLIC = "public",
  PRIVATE = "private",
}

export type AsyncUpload = (
  params: Aws.S3.PutObjectRequest,
  options?: Aws.S3.ManagedUpload.ManagedUploadOptions
) => Promise<Aws.S3.ManagedUpload.SendData>;
