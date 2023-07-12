import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import { randomUUID } from "crypto";
import { Readable } from "stream";

@Injectable()
export class MediaService {
  private S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
  private S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
  private S3_REGION = process.env.S3_REGION;
  private S3_BUCKET = process.env.S3_BUCKET;
  private S3_ENDPOINT = process.env.S3_ENDPOINT;

  private S3_CLIENT = new S3Client({
    credentials: {
      accessKeyId: this.S3_ACCESS_KEY,
      secretAccessKey: this.S3_SECRET_ACCESS_KEY,
    },
    endpoint: this.S3_ENDPOINT,
    region: this.S3_REGION,
  });

  async upload(file: Express.Multer.File, folder = "images") {
    try {
      const file_extension =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      const file_name = `${folder}/${randomUUID()}.${file_extension}`;

      const params: PutObjectCommandInput = {
        Bucket: this.S3_BUCKET,
        Key: file_name,
        Body: file.buffer,
      };

      await this.S3_CLIENT.send(new PutObjectCommand(params));

      return {
        key: file_name,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || "An error occurred",
      );
    }
  }

  async download(key: string, expiresIn = 60 * 5) {
    const getCommand = new GetObjectCommand({
      Key: key,
      Bucket: this.S3_BUCKET,
    });
    const url = await getSignedUrl(this.S3_CLIENT, getCommand, {
      expiresIn,
    });

    return { url };
  }

  async downloadToFile(key: string, expiresIn = 60 * 5) {
    const { url: fileUrl } = await this.download(key, expiresIn);

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    const file: Express.Multer.File = {
      fieldname: "file",
      originalname: key,
      mimetype: response.headers["content-type"] || "",
      size: response.data.length,
      buffer: Buffer.from(response.data),
      encoding: "",
      stream: new Readable(),
      destination: "",
      filename: "",
      path: "",
    };

    return file;
  }
}
