import fs from "fs";
import AWS from "aws-sdk";
import s3Zip from "s3-zip";
import path from "path";
const join = path.join;
import ContractModel from "../../model/contractModel.js";
const uploadFile = async (req, res) => {
  console.log("uploadFile", req.files);
  const { id } = req.query;
  console.log("id", id);

  if (req.files.length > 0) {
    try {
      if (req.files && req.files.length > 0) {
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
    } catch (e) {
      console.log("Error", e);
    }
    res.send({ ok: true, message: "File is uploaded" });
  } else {
    res.send({ ok: false, message: "No files" });
  }
};
const checkContractExist = async (req, res, next) => {
  const { id } = req.query;
  console.log("id", id);

  try {
    const docExist = await ContractModel.findOne({ id: id });
    if (docExist) {
      res.status(400).send({ ok: false, message: "Document already exist" });
    } else {
      console.log("docExist", docExist);
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
    });
    const files = s3
      .listObjects({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: folder,
      })
      .createReadStream();
    function zip(files) {
      console.log(files);
      // const output = fs.createWriteStream(join(__dirname, "use-s3-zip.zip"));
      s3Zip
        .setFormat("tar")
        .archive(
          {
            region: process.env.LOCATION,
            bucket: process.env.AWS_BUCKET_NAME,
            preserveFolderStructure: true,
          },
          folder,
          files
        )
        .pipe(res);
    }
    zip(fileNames);
    // const file = s3Zip
    //   .archive(
    //     {
    //       s3: s3,
    //       region: process.env.LOCATION,
    //       bucket: process.env.AWS_BUCKET_NAME,
    //       debug: true,
    //     },
    //     folder,
    //     fileNames
    //   )
    //   .pipe(res)
    //   .on("finish", () => {
    //     console.log("finish");
    //   });
    // console.log("file Here", file);
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
