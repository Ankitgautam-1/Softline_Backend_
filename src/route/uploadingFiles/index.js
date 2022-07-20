import fs from "fs";
import AWS from "aws-sdk";
import s3Zip from "s3-zip";
import ContractModel from "../../model/contractModel.js";
const uploadFile = async (req, res) => {
  console.log("uploadFile", req.files);
  const { id } = req.body;
  if (req.files.length > 0) {
    try {
      const contractExist = await ContractModel.findOne({
        id: id,
      });
      if (contractExist) {
        res.send({ ok: false, message: "Contract ID already exist" });
      } else {
        if (req.files) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          });
          console.log("files", req.files.length);
          for (let i = 0; i < req.files.length; i++) {
            s3.upload(
              {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: fs.createReadStream(req.files[i].path),
                Key: `${id}/${req.files[i].originalname}`,
              },
              (err, data) => {
                if (err) {
                  console.log("error", err);
                } else {
                  console.log("data", data);
                  req.files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                      console.log("error", err);
                    });
                  });
                }
              }
            );
          }
        } else {
          res.send({ ok: false, message: "No file to upload" });
        }
      }
    } catch (e) {
      console.log("Error", e);
    }
    res.send({ ok: true, files: req.files });
  } else {
    res.send({ ok: false, message: "No files" });
  }
};
const checkContractExist = async (req, res, next) => {
  const { id } = req.body;
  try {
    const docExist = await ContractModel.findOne({ id: id });
    if (docExist) {
      res.status(400).send({ ok: false, message: "Document already exist" });
    } else {
      next();
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
};
const getFiles = async (req, res) => {
  const fileNames = req.fileNames;
  console.log("fileNames", fileNames);

  const folder = req.folder;
  if (fileNames.length > 0) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
      s3ForcePathStyle: true,
    });
    s3Zip
      .setFormat("tar")
      .archive(
        {
          s3: s3,
          region: process.env.LOCATION,
          bucket: process.env.AWS_BUCKET_NAME,
          debug: true,
        },
        folder,
        fileNames
      )
      .pipe(res);
  }
};

const getNameOfAllFile = async (req, res, next) => {
  const { folder } = req.query;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const response = await s3
    .listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: folder,
    })
    .promise();
  console.log("response", response);

  if (response.Contents.length > 0) {
    console.log(response.Contents);
    const fileNames = response.Contents.map((file) => {
      const names = file.Key.toString().split("/");
      return names[1];
    });
    req.fileNames = fileNames;
    req.folder = folder;
    next();
  } else {
    res.status(400).send({ ok: false, message: "No file found" });
  }
};
export default uploadFile;

export { checkContractExist, getFiles, getNameOfAllFile };
