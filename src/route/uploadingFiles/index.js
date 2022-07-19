import fs from "fs";
import AWS from "aws-sdk";
import ContractModel from "../../model/contractModel.js";
const uploadFile = async (req, res) => {
  console.log("uploadFile", req.files);
  const { contract_id } = req.body;

  res.send({ ok: true, file: req.files });
  try {
    const contractExist = await ContractModel.findOne({
      id: contract_id,
    });
    if (contractExist) {
      res.send({ ok: false, message: "Contract ID already exist" });
    } else {
      if (req.files) {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        for (let i = 0; i < req.files.length; i++) {
          console.log("files", i);

          // s3.upload(
          //   {
          //     Bucket: process.env.AWS_BUCKET_NAME,
          //     Body: fs.createReadStream(req.files[i].path),
          //     Key: `${contract_id}/${req.files[i].originalname}`,
          //   },
          //   (err, data) => {
          //     if (err) {
          //       console.log("error", err);
          //     } else {
          //       console.log("data", data);
          //       req.files.forEach((file) => {
          //         fs.unlink(file.path, (err) => {
          //           console.log("error", err);
          //         });
          //       });
          //     }
          //   }
          // );
        }
      } else {
        res.send({ ok: false, message: "No file to upload" });
      }
    }
  } catch (e) {
    console.log("Error", e);
  }
};
const checkContractExist = async (req, res, next) => {
  const { contract_id } = req.body;
  try {
    const docExist = await ContractModel.findOne({ contract_id });
    if (docExist) {
      res.status(400).send({ ok: false, message: "Document already exist" });
    } else {
      next();
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
};
export default uploadFile;
export { checkContractExist };
